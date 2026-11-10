"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = exports.subscribe = void 0;
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const newsletterSubscriber_model_1 = require("../../models/newsletterSubscriber.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const mail_service_1 = require("../../services/mail.service");
const subscribeSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
});
// POST /api/v1/newsletter/subscribe
exports.subscribe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Email invalide');
    const { email } = parsed.data;
    const existing = await newsletterSubscriber_model_1.NewsletterSubscriber.findOne({ where: { email } });
    if (existing) {
        if (!existing.isActive) {
            await existing.update({ isActive: true });
        }
        // Idempotent : on ne renvoie pas d'erreur si déjà inscrit, mais pas de mail non plus.
        return (0, response_1.sendResponse)(res, { responseCode: '00', responseMessage: 'Vous êtes déjà inscrit à la newsletter.', data: null });
    }
    const unsubscribeToken = crypto_1.default.randomBytes(24).toString('hex');
    await newsletterSubscriber_model_1.NewsletterSubscriber.create({ email, unsubscribeToken, isActive: true });
    const mail = mail_service_1.mailTemplates.newsletterWelcome();
    (0, mail_service_1.sendMail)({ to: email, ...mail }); // fire-and-forget : ne bloque jamais la confirmation d'inscription
    return (0, response_1.sendResponse)(res, { responseCode: '01', responseMessage: 'Inscription réussie !', data: null });
});
// POST /api/v1/newsletter/unsubscribe  body: { token }
exports.unsubscribe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const token = String(req.body.token || req.query.token || '');
    if (!token)
        return (0, response_1.sendError)(res, '11', 'Token requis');
    const subscriber = await newsletterSubscriber_model_1.NewsletterSubscriber.findOne({ where: { unsubscribeToken: token } });
    if (!subscriber)
        return (0, response_1.sendError)(res, '30', 'Abonnement introuvable');
    await subscriber.update({ isActive: false });
    return (0, response_1.sendResponse)(res, { responseCode: '00', responseMessage: 'Désabonnement effectué.', data: null });
});
