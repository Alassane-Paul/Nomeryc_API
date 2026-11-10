"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = void 0;
exports.createContactRequestService = createContactRequestService;
const contactRequest_model_1 = require("../../../models/contactRequest.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
const mail_service_1 = require("../../../services/mail.service");
const notification_service_1 = require("../../../services/notification.service");
const zod_1 = require("zod");
const service_enum_1 = require("../../../enums/service.enum");
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nom requis'),
    email: zod_1.z.string().email('Email invalide'),
    phone: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    service: zod_1.z.nativeEnum(service_enum_1.ServiceType).optional(),
    budgetMin: zod_1.z.number().optional(),
    budgetMax: zod_1.z.number().optional(),
    message: zod_1.z.string().min(10, 'Message trop court'),
});
async function createContactRequestService(data) {
    const contact = await contactRequest_model_1.ContactRequest.create(data);
    const admins = await user_model_1.User.findAll({ where: { role: user_enum_1.UserRole.ADMIN }, attributes: ['id', 'email'] });
    const mail = mail_service_1.mailTemplates.contactReceived(data.name, data.email, data.message);
    admins.forEach((admin) => (0, mail_service_1.sendMail)({ to: admin.email, ...mail }));
    (0, notification_service_1.notifyMany)(admins.map((admin) => admin.id), {
        title: 'Nouvelle demande de contact',
        message: `${data.name} — ${data.message.slice(0, 80)}`,
        type: 'SYSTEM',
        link: '/admin/contacts',
    });
    return contact;
}
