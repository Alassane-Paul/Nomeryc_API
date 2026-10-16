import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { verifyToken } from '../utils/jwt.utils';
import { UserRole } from '../enums/user.enum';
import { env } from './env';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: UserRole;
}

let io: Server | null = null;

/** Room personnelle d'un utilisateur. */
export const userRoom = (userId: string) => `user:${userId}`;
/** Room commune à tous les admins connectés. */
export const ADMIN_ROOM = 'admins';

/**
 * Branche l'adaptateur Redis si REDIS_URL est défini : indispensable dès que
 * l'API tourne en plusieurs instances (sinon un utilisateur connecté sur
 * l'instance A ne reçoit jamais les événements émis depuis l'instance B).
 * Sans REDIS_URL, Socket.IO reste en mémoire — parfait pour une seule instance.
 */
async function attachRedisAdapter(server: Server): Promise<void> {
  if (!env.REDIS_URL) {
    console.log('ℹ️  REDIS_URL non défini : Socket.IO fonctionne en mémoire (une seule instance).');
    return;
  }

  try {
    const pubClient = createClient({ url: env.REDIS_URL });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.error('[redis pub]', err.message));
    subClient.on('error', (err) => console.error('[redis sub]', err.message));

    await Promise.all([pubClient.connect(), subClient.connect()]);
    server.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Adaptateur Redis Socket.IO connecté — prêt pour le multi-instance.');
  } catch (err: any) {
    console.error('⚠️  Connexion Redis échouée, Socket.IO reste en mémoire :', err?.message);
  }
}

export async function initSocket(httpServer: HttpServer): Promise<Server> {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  await attachRedisAdapter(io);

  // ===== AUTHENTIFICATION (handshake) =====
  io.use((socket: AuthenticatedSocket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers.authorization || '').replace('Bearer ', '');

    if (!token) return next(new Error('Authentification requise'));

    const decoded = verifyToken(token);
    if (!decoded || decoded.type !== 'access_token') {
      return next(new Error('Token invalide ou expiré'));
    }

    socket.userId = decoded.userId;
    socket.userRole = decoded.role as UserRole;
    next();
  });

  // ===== CONNEXION =====
  io.on('connection', (socket: AuthenticatedSocket) => {
    socket.join(userRoom(socket.userId!));
    if (socket.userRole === UserRole.ADMIN) {
      socket.join(ADMIN_ROOM);
    }

    if (env.NODE_ENV === 'development') {
      console.log(`🔌 Socket connecté : ${socket.userId} (${socket.userRole})`);
    }

    // Indicateur "en train d'écrire"
    socket.on('typing', (payload: { clientId?: string; isTyping: boolean }) => {
      if (socket.userRole === UserRole.ADMIN && payload?.clientId) {
        socket.to(userRoom(payload.clientId)).emit('typing', { isTyping: payload.isTyping, from: 'admin' });
      } else {
        socket.to(ADMIN_ROOM).emit('typing', { isTyping: payload?.isTyping, clientId: socket.userId });
      }
    });

    socket.on('disconnect', () => {
      if (env.NODE_ENV === 'development') {
        console.log(`🔌 Socket déconnecté : ${socket.userId}`);
      }
    });
  });

  return io;
}

export function getIO(): Server | null {
  return io;
}

/** Émet un événement vers un utilisateur précis. */
export function emitToUser(userId: string, event: string, payload: any) {
  io?.to(userRoom(userId)).emit(event, payload);
}

/** Émet un événement vers tous les admins connectés. */
export function emitToAdmins(event: string, payload: any) {
  io?.to(ADMIN_ROOM).emit(event, payload);
}
