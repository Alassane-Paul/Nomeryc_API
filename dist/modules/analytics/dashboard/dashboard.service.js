"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardAnalyticsService = getDashboardAnalyticsService;
const sequelize_1 = require("sequelize");
const user_model_1 = require("../../../models/user.model");
const project_model_1 = require("../../../models/project.model");
const quote_model_1 = require("../../../models/quote.model");
const invoice_model_1 = require("../../../models/invoice.model");
const contactRequest_model_1 = require("../../../models/contactRequest.model");
const invoice_enum_1 = require("../../../enums/invoice.enum");
const user_enum_1 = require("../../../enums/user.enum");
function lastMonths(count) {
    const months = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        months.push({
            key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
            label: start.toLocaleDateString('fr-FR', { month: 'short' }),
            start,
            end,
        });
    }
    return months;
}
async function getDashboardAnalyticsService() {
    const [totalClients, totalProjects, activeProjects, totalQuotes, acceptedQuotes, invoices, recentContacts] = await Promise.all([
        user_model_1.User.count({ where: { role: user_enum_1.UserRole.CLIENT } }),
        project_model_1.Project.count(),
        project_model_1.Project.count({ where: { status: { [sequelize_1.Op.notIn]: ['termine', 'annule'] } } }),
        quote_model_1.Quote.count(),
        quote_model_1.Quote.count({ where: { status: 'accepte' } }),
        invoice_model_1.Invoice.findAll({ attributes: ['totalTTC', 'status', 'paidAt', 'createdAt'] }),
        contactRequest_model_1.ContactRequest.count({ where: { status: 'nouveau' } }),
    ]);
    const totalRevenue = invoices
        .filter((invoice) => invoice.status === invoice_enum_1.InvoiceStatus.PAYE)
        .reduce((sum, invoice) => sum + Number(invoice.totalTTC || 0), 0);
    const pendingRevenue = invoices
        .filter((invoice) => invoice.status !== invoice_enum_1.InvoiceStatus.PAYE && invoice.status !== invoice_enum_1.InvoiceStatus.ANNULE)
        .reduce((sum, invoice) => sum + Number(invoice.totalTTC || 0), 0);
    const months = lastMonths(6);
    const revenueByMonth = months.map(({ key, label, start, end }) => {
        const total = invoices
            .filter((invoice) => invoice.status === invoice_enum_1.InvoiceStatus.PAYE &&
            invoice.paidAt &&
            new Date(invoice.paidAt) >= start &&
            new Date(invoice.paidAt) < end)
            .reduce((sum, invoice) => sum + Number(invoice.totalTTC || 0), 0);
        return { month: label, key, total: Math.round(total) };
    });
    const projectsByStatusRaw = await project_model_1.Project.findAll({
        attributes: ['status', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
        group: ['status'],
        raw: true,
    });
    const projectsByStatus = projectsByStatusRaw.map((row) => ({
        status: row.status,
        count: Number(row.count),
    }));
    const invoicesByStatusRaw = await invoice_model_1.Invoice.findAll({
        attributes: ['status', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
        group: ['status'],
        raw: true,
    });
    const invoicesByStatus = invoicesByStatusRaw.map((row) => ({
        status: row.status,
        count: Number(row.count),
    }));
    const conversionRate = totalQuotes > 0 ? Math.round((acceptedQuotes / totalQuotes) * 100) : 0;
    return {
        totals: {
            clients: totalClients,
            projects: totalProjects,
            activeProjects,
            quotes: totalQuotes,
            acceptedQuotes,
            conversionRate,
            revenue: Math.round(totalRevenue),
            pendingRevenue: Math.round(pendingRevenue),
            newContactRequests: recentContacts,
        },
        revenueByMonth,
        projectsByStatus,
        invoicesByStatus,
    };
}
