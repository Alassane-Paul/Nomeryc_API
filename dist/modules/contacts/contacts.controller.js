"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactRequest = exports.updateContactStatus = exports.getContactRequests = exports.createContactRequest = exports.contactLimiter = void 0;
const contactRequest_model_1 = require("../../models/contactRequest.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const service_enum_1 = require("../../enums/service.enum");
const zod_1 = require("zod");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const user_model_1 = require("../../models/user.model");
const user_enum_1 = require("../../enums/user.enum");
const mail_service_1 = require("../../services/mail.service");
const notification_service_1 = require("../../services/notification.service");
exports.contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { responseCode: '98', responseMessage: 'Trop de messages envoyés, réessayez dans 1 heure.' },
});
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nom requis'),
    email: zod_1.z.string().email('Email invalide'),
    phone: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    service: zod_1.z.nativeEnum(service_enum_1.ServiceType).optional(),
    budgetMin: zod_1.z.number().optional(),
    budgetMax: zod_1.z.number().optional(),
    message: zod_1.z.string().min(10, 'Message trop court'),
});
exports.createContactRequest = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const contact = await contactRequest_model_1.ContactRequest.create(parsed.data);
    // Équipe prévenue par email + notification (ne bloque jamais la réponse au visiteur).
    const admins = await user_model_1.User.findAll({ where: { role: user_enum_1.UserRole.ADMIN }, attributes: ['id', 'email'] });
    const mail = mail_service_1.mailTemplates.contactReceived(parsed.data.name, parsed.data.email, parsed.data.message);
    admins.forEach((admin) => (0, mail_service_1.sendMail)({ to: admin.email, ...mail }));
    (0, notification_service_1.notifyMany)(admins.map((a) => a.id), {
        title: 'Nouvelle demande de contact',
        message: `${parsed.data.name} — ${parsed.data.message.slice(0, 80)}`,
        type: 'SYSTEM',
        link: '/admin/contacts',
    });
    return (0, response_1.sendResponse)(res, {
        responseCode: '01',
        responseMessage: 'Votre message a bien été envoyé. Nous vous contacterons bientôt !',
        data: { id: contact.id },
    });
});
exports.getContactRequests = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status } = req.query;
    const where = {};
    if (status)
        where.status = status;
    const contacts = await contactRequest_model_1.ContactRequest.findAll({
        where,
        order: [['createdAt', 'DESC']],
    });
    return (0, response_1.sendResponse)(res, { data: contacts });
});
exports.updateContactStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const contact = await contactRequest_model_1.ContactRequest.findByPk(String(req.params.id));
    if (!contact)
        return (0, response_1.sendError)(res, '30', 'Demande non trouvée');
    await contact.update({ status: req.body.status, notes: req.body.notes, assignedTo: req.body.assignedTo });
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: contact });
});
exports.deleteContactRequest = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const contact = await contactRequest_model_1.ContactRequest.findByPk(String(req.params.id));
    if (!contact)
        return (0, response_1.sendError)(res, '30', 'Demande non trouvée');
    await contact.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
