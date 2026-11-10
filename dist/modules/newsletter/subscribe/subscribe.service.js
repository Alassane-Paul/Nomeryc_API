"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeService = subscribeService;
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const newsletterSubscriber_model_1 = require("../../../models/newsletterSubscriber.model");
const mail_service_1 = require("../../../services/mail.service");
const subscribeSchema = zod_1.z.object({ email: zod_1.z.string().email('Email invalide') });
async function subscribeService(body) {
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success)
        return { error: true };
    const { email } = parsed.data;
    const existing = await newsletterSubscriber_model_1.NewsletterSubscriber.findOne({ where: { email } });
    if (existing) {
        if (!existing.isActive)
            await existing.update({ isActive: true });
        return { alreadySubscribed: true };
    }
    const unsubscribeToken = crypto_1.default.randomBytes(24).toString('hex');
    await newsletterSubscriber_model_1.NewsletterSubscriber.create({ email, unsubscribeToken, isActive: true });
    const mail = mail_service_1.mailTemplates.newsletterWelcome();
    (0, mail_service_1.sendMail)({ to: email, ...mail });
    return { alreadySubscribed: false };
}
