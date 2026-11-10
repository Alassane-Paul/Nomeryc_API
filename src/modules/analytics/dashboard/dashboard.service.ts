import { Op, fn, col } from 'sequelize';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';
import { Quote } from '../../../models/quote.model';
import { Invoice } from '../../../models/invoice.model';
import { ContactRequest } from '../../../models/contactRequest.model';
import { InvoiceStatus } from '../../../enums/invoice.enum';
import { UserRole } from '../../../enums/user.enum';

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

export async function getDashboardAnalyticsService() {
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
    .filter((invoice) => invoice.status === InvoiceStatus.PAYE)
    .reduce((sum, invoice) => sum + Number(invoice.totalTTC || 0), 0);

  const pendingRevenue = invoices
    .filter((invoice) => invoice.status !== InvoiceStatus.PAYE && invoice.status !== InvoiceStatus.ANNULE)
    .reduce((sum, invoice) => sum + Number(invoice.totalTTC || 0), 0);

  const months = lastMonths(6);
  const revenueByMonth = months.map(({ key, label, start, end }) => {
    const total = invoices
      .filter(
        (invoice) =>
          invoice.status === InvoiceStatus.PAYE &&
          invoice.paidAt &&
          new Date(invoice.paidAt) >= start &&
          new Date(invoice.paidAt) < end,
      )
      .reduce((sum, invoice) => sum + Number(invoice.totalTTC || 0), 0);
    return { month: label, key, total: Math.round(total) };
  });

  const projectsByStatusRaw = await Project.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    raw: true,
  });
  const projectsByStatus = (projectsByStatusRaw as any[]).map((row) => ({
    status: row.status,
    count: Number(row.count),
  }));

  const invoicesByStatusRaw = await Invoice.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    raw: true,
  });
  const invoicesByStatus = (invoicesByStatusRaw as any[]).map((row) => ({
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
