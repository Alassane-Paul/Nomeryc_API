"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuoteStatus = updateQuoteStatus;
const quote_model_1 = require("../../../models/quote.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
const quote_enum_1 = require("../../../enums/quote.enum");
const mail_service_1 = require("../../../services/mail.service");
const notification_service_1 = require("../../../services/notification.service");
async function updateQuoteStatus(id, userId, role, status) {
    const isAdmin = role === user_enum_1.UserRole.ADMIN;
    const where = { id };
    if (!isAdmin)
        where.clientId = userId;
    const quote = await quote_model_1.Quote.findOne({ where });
    if (!quote)
        return { error: 'not-found' };
    if (!Object.values(quote_enum_1.QuoteStatus).includes(status))
        return { error: 'invalid-status' };
    if (!isAdmin && ![quote_enum_1.QuoteStatus.ACCEPTE, quote_enum_1.QuoteStatus.REFUSE].includes(status)) {
        return { error: 'forbidden' };
    }
    await quote.update({ status });
    if (isAdmin && status === quote_enum_1.QuoteStatus.ENVOYE) {
        const client = await user_model_1.User.findByPk(quote.clientId);
        if (client) {
            const mail = mail_service_1.mailTemplates.quoteSent(client.firstName, quote.quoteNumber, quote.totalTTC);
            (0, mail_service_1.sendMail)({ to: client.email, ...mail });
            (0, notification_service_1.notify)({
                userId: client.id,
                title: 'Nouveau devis disponible',
                message: `Devis ${quote.quoteNumber} — ${quote.totalTTC.toLocaleString('fr-FR')} FCFA`,
                type: 'QUOTE',
                link: '/client/devis',
            });
        }
    }
    if (!isAdmin) {
        const admins = await user_model_1.User.findAll({ where: { role: user_enum_1.UserRole.ADMIN }, attributes: ['id'] });
        const label = status === quote_enum_1.QuoteStatus.ACCEPTE ? 'accepté' : 'refusé';
        admins.forEach(admin => (0, notification_service_1.notify)({
            userId: admin.id,
            title: `Devis ${label}`,
            message: `Le devis ${quote.quoteNumber} a été ${label} par le client`,
            type: 'QUOTE',
            link: '/admin/devis',
        }));
    }
    return { quote };
}
