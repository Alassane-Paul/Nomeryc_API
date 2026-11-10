"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicStats = exports.getDashboardAnalytics = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = require("../../models/user.model");
const project_model_1 = require("../../models/project.model");
const quote_model_1 = require("../../models/quote.model");
const invoice_model_1 = require("../../models/invoice.model");
const contactRequest_model_1 = require("../../models/contactRequest.model");
const testimonial_model_1 = require("../../models/testimonial.model");
const teamMember_model_1 = require("../../models/teamMember.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const user_enum_1 = require("../../enums/user.enum");
const invoice_enum_1 = require("../../enums/invoice.enum");
const projet_enum_1 = require("../../enums/projet.enum");
/** 6 derniers mois, y compris le mois en cours, format { key: 'YYYY-MM', label: 'janv.' } */
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
// GET /api/v1/analytics/dashboard (admin uniquement)
exports.getDashboardAnalytics = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
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
        .filter((i) => i.status === invoice_enum_1.InvoiceStatus.PAYE)
        .reduce((sum, i) => sum + Number(i.totalTTC || 0), 0);
    const pendingRevenue = invoices
        .filter((i) => i.status !== invoice_enum_1.InvoiceStatus.PAYE && i.status !== invoice_enum_1.InvoiceStatus.ANNULE)
        .reduce((sum, i) => sum + Number(i.totalTTC || 0), 0);
    // ===== Revenu encaissé par mois (6 derniers mois) =====
    const months = lastMonths(6);
    const revenueByMonth = months.map(({ key, label, start, end }) => {
        const total = invoices
            .filter((i) => i.status === invoice_enum_1.InvoiceStatus.PAYE && i.paidAt && new Date(i.paidAt) >= start && new Date(i.paidAt) < end)
            .reduce((sum, i) => sum + Number(i.totalTTC || 0), 0);
        return { month: label, key, total: Math.round(total) };
    });
    // ===== Répartition des projets par statut =====
    const projectsByStatusRaw = await project_model_1.Project.findAll({
        attributes: ['status', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
        group: ['status'],
        raw: true,
    });
    const projectsByStatus = projectsByStatusRaw.map((r) => ({ status: r.status, count: Number(r.count) }));
    // ===== Répartition des factures par statut =====
    const invoicesByStatusRaw = await invoice_model_1.Invoice.findAll({
        attributes: ['status', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
        group: ['status'],
        raw: true,
    });
    const invoicesByStatus = invoicesByStatusRaw.map((r) => ({ status: r.status, count: Number(r.count) }));
    const conversionRate = totalQuotes > 0 ? Math.round((acceptedQuotes / totalQuotes) * 100) : 0;
    return (0, response_1.sendResponse)(res, {
        data: {
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
        },
    });
});
// GET /api/v1/analytics/public-stats (public, sans authentification)
// Chiffres réels affichés sur la page "À propos" du site public.
exports.getPublicStats = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const [projectsDelivered, clientsCount, teamSize, testimonials] = await Promise.all([
        project_model_1.Project.count({ where: { status: projet_enum_1.ProjectStatus.TERMINE } }),
        user_model_1.User.count({ where: { role: user_enum_1.UserRole.CLIENT } }),
        teamMember_model_1.TeamMember.count(),
        testimonial_model_1.Testimonial.findAll({ attributes: ['rating'], where: { isPublic: true } }),
    ]);
    const ratings = testimonials.map((t) => t.rating).filter((r) => typeof r === 'number');
    const averageRating = ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null;
    return (0, response_1.sendResponse)(res, {
        data: { projectsDelivered, clientsCount, teamSize, averageRating, reviewsCount: ratings.length },
    });
});
