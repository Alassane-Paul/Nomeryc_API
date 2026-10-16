import { Response } from 'express';
import { Op, fn, col, literal } from 'sequelize';
import { User } from '../../models/user.model';
import { Project } from '../../models/project.model';
import { Quote } from '../../models/quote.model';
import { Invoice } from '../../models/invoice.model';
import { ContactRequest } from '../../models/contactRequest.model';
import { Testimonial } from '../../models/testimonial.model';
import { TeamMember } from '../../models/teamMember.model';
import { sendResponse } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { UserRole } from '../../enums/user.enum';
import { InvoiceStatus } from '../../enums/invoice.enum';
import { ProjectStatus } from '../../enums/projet.enum';

/** 6 derniers mois, y compris le mois en cours, format { key: 'YYYY-MM', label: 'janv.' } */
function lastMonths(count: number) {
  const months: { key: string; label: string; start: Date; end: Date }[] = [];
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
export const getDashboardAnalytics = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [totalClients, totalProjects, activeProjects, totalQuotes, acceptedQuotes, invoices, recentContacts] =
    await Promise.all([
      User.count({ where: { role: UserRole.CLIENT } }),
      Project.count(),
      Project.count({ where: { status: { [Op.notIn]: ['termine', 'annule'] } } }),
      Quote.count(),
      Quote.count({ where: { status: 'accepte' } }),
      Invoice.findAll({ attributes: ['totalTTC', 'status', 'paidAt', 'createdAt'] }),
      ContactRequest.count({ where: { status: 'nouveau' } }),
    ]);

  const totalRevenue = invoices
    .filter((i) => i.status === InvoiceStatus.PAYE)
    .reduce((sum, i) => sum + Number(i.totalTTC || 0), 0);

  const pendingRevenue = invoices
    .filter((i) => i.status !== InvoiceStatus.PAYE && i.status !== InvoiceStatus.ANNULE)
    .reduce((sum, i) => sum + Number(i.totalTTC || 0), 0);

  // ===== Revenu encaissé par mois (6 derniers mois) =====
  const months = lastMonths(6);
  const revenueByMonth = months.map(({ key, label, start, end }) => {
    const total = invoices
      .filter((i) => i.status === InvoiceStatus.PAYE && i.paidAt && new Date(i.paidAt) >= start && new Date(i.paidAt) < end)
      .reduce((sum, i) => sum + Number(i.totalTTC || 0), 0);
    return { month: label, key, total: Math.round(total) };
  });

  // ===== Répartition des projets par statut =====
  const projectsByStatusRaw = await Project.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    raw: true,
  });
  const projectsByStatus = (projectsByStatusRaw as any[]).map((r) => ({ status: r.status, count: Number(r.count) }));

  // ===== Répartition des factures par statut =====
  const invoicesByStatusRaw = await Invoice.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    raw: true,
  });
  const invoicesByStatus = (invoicesByStatusRaw as any[]).map((r) => ({ status: r.status, count: Number(r.count) }));

  const conversionRate = totalQuotes > 0 ? Math.round((acceptedQuotes / totalQuotes) * 100) : 0;

  return sendResponse(res, {
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
export const getPublicStats = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [projectsDelivered, clientsCount, teamSize, testimonials] = await Promise.all([
    Project.count({ where: { status: ProjectStatus.TERMINE } }),
    User.count({ where: { role: UserRole.CLIENT } }),
    TeamMember.count(),
    Testimonial.findAll({ attributes: ['rating'], where: { isPublic: true } }),
  ]);

  const ratings = testimonials.map((t) => t.rating).filter((r): r is number => typeof r === 'number');
  const averageRating = ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null;

  return sendResponse(res, {
    data: { projectsDelivered, clientsCount, teamSize, averageRating, reviewsCount: ratings.length },
  });
});
