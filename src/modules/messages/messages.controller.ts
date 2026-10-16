import { Response } from 'express';
import { Op } from 'sequelize';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { UserRole } from '../../enums/user.enum';
import { emitToUser, emitToAdmins } from '../../config/socket';
import { notify, notifyMany } from '../../services/notification.service';

const senderInclude = { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
const recipientInclude = { model: User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };

// GET /api/v1/messages?projectId=...   ou   ?clientId=... (admin uniquement)
export const getMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const { projectId, clientId } = req.query;
  let where: any;

  if (projectId) {
    where = { projectId };
  } else if (isAdmin) {
    if (!clientId) {
      return sendError(res, '11', 'clientId requis pour un admin (ou utilisez /messages/conversations)');
    }
    // Fil de discussion avec ce client : ses messages sortants (recipientId null)
    // + les réponses qui lui sont adressées.
    where = { [Op.or]: [{ senderId: clientId }, { recipientId: clientId }] };
  } else {
    // Le client voit tout ce qu'il a envoyé + tout ce qui lui a été adressé.
    where = { [Op.or]: [{ senderId: req.user?.id }, { recipientId: req.user?.id }] };
  }

  const messages = await Message.findAll({
    where,
    include: [senderInclude, recipientInclude],
    order: [['createdAt', 'ASC']],
  });

  return sendResponse(res, { data: messages });
});

// GET /api/v1/messages/conversations (admin uniquement)
// Liste des clients ayant échangé, avec dernier message + nb de non-lus.
export const getConversations = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const messages = await Message.findAll({
    include: [senderInclude, recipientInclude],
    order: [['createdAt', 'DESC']],
  });

  const conversations = new Map<string, { client: any; lastMessage: Message; unreadCount: number }>();

  for (const msg of messages as any[]) {
    const client = msg.sender?.role === UserRole.CLIENT ? msg.sender : msg.recipient?.role === UserRole.CLIENT ? msg.recipient : null;
    if (!client) continue; // message sans lien avec un client (ne devrait pas arriver)

    if (!conversations.has(client.id)) {
      conversations.set(client.id, { client, lastMessage: msg, unreadCount: 0 });
    }
    // Non-lu = message envoyé PAR le client et pas encore lu par l'équipe.
    if (msg.senderId === client.id && !msg.isRead) {
      conversations.get(client.id)!.unreadCount += 1;
    }
  }

  return sendResponse(res, { data: Array.from(conversations.values()) });
});

// POST /api/v1/messages
export const sendMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const { projectId, content, attachments } = req.body;
  let recipientId: string | null = req.body.recipientId || null;

  if (!content || content.trim().length === 0) {
    return sendError(res, '11', 'Le message ne peut pas être vide');
  }

  if (isAdmin) {
    if (!recipientId) {
      return sendError(res, '11', 'recipientId requis : un admin doit préciser le client destinataire');
    }
    const client = await User.findByPk(recipientId);
    if (!client || client.role !== UserRole.CLIENT) {
      return sendError(res, '11', 'Destinataire invalide');
    }
  } else {
    // Un client s'adresse toujours au support ; on ignore tout recipientId fourni.
    recipientId = null;
  }

  const message = await Message.create({
    senderId: req.user!.id,
    projectId,
    recipientId: recipientId ?? undefined,
    content: content.trim(),
    attachments,
    isRead: false,
  });

  const fullMessage = await Message.findByPk(message.id, {
    include: [senderInclude, recipientInclude],
  });

  // ===== TEMPS RÉEL + NOTIFICATIONS PERSISTANTES =====
  if (isAdmin) {
    // Réponse de l'équipe → le client concerné.
    emitToUser(recipientId!, 'message:new', fullMessage);
    emitToAdmins('message:new', fullMessage);
    notify({
      userId: recipientId!,
      title: 'Nouveau message',
      message: content.trim().slice(0, 100),
      type: 'MESSAGE',
      link: '/client/messages',
    });
  } else {
    // Message client → tous les admins connectés.
    emitToAdmins('message:new', fullMessage);
    const admins = await User.findAll({ where: { role: UserRole.ADMIN }, attributes: ['id'] });
    notifyMany(admins.map((a) => a.id), {
      title: 'Nouveau message client',
      message: content.trim().slice(0, 100),
      type: 'MESSAGE',
      link: '/admin/messages',
    });
  }

  return sendResponse(res, { responseCode: '01', data: fullMessage });
});

// PATCH /api/v1/messages/:id/read
export const markMessageAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const message = await Message.findByPk(String(req.params.id));
  if (!message) return sendError(res, '30', 'Message non trouvé');

  // Un admin peut marquer comme lu tout message qui ne vient pas de lui-même
  // (i.e. un message client). Un client ne peut marquer comme lu que ce qui lui est adressé.
  const authorized = isAdmin ? message.senderId !== req.user?.id : message.recipientId === req.user?.id;
  if (!authorized) return sendError(res, '23', 'Accès refusé');

  await message.update({ isRead: true });

  // Accusé de lecture temps réel vers l'expéditeur.
  emitToUser(message.senderId, 'message:read', { ids: [message.id] });

  return sendResponse(res, { responseCode: '02', data: message });
});

// PATCH /api/v1/messages/read-all
// Client : marque tout ce qui lui a été adressé comme lu.
// Admin : body/query { clientId } — marque tous les messages de ce client comme lus.
export const markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;

  if (isAdmin) {
    const clientId = (req.body.clientId || req.query.clientId) as string | undefined;
    if (!clientId) return sendError(res, '11', 'clientId requis');
    await Message.update({ isRead: true }, { where: { senderId: clientId, isRead: false } });
    emitToUser(clientId, 'message:read', { all: true });
  } else {
    await Message.update({ isRead: true }, { where: { recipientId: req.user?.id, isRead: false } });
    emitToAdmins('message:read', { all: true, clientId: req.user?.id });
  }

  return sendResponse(res, { responseMessage: 'Tous les messages marqués comme lus', data: null });
});

// DELETE /api/v1/messages/:id
export const deleteMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const message = await Message.findOne({
    where: { id: req.params.id, senderId: req.user?.id },
  });
  if (!message) return sendError(res, '30', 'Message non trouvé');
  const { id, recipientId } = message;
  await message.destroy();

  emitToAdmins('message:deleted', { id });
  if (recipientId) emitToUser(recipientId, 'message:deleted', { id });

  return sendResponse(res, { responseCode: '03', data: null });
});
