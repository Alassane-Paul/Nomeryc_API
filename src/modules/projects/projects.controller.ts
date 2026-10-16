import { Response } from 'express';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { Quote } from '../../models/quote.model';
import { Invoice } from '../../models/invoice.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { UserRole } from '../../enums/user.enum';
import { ProjectStatus } from '../../enums/projet.enum';
import { ServiceType } from '../../enums/service.enum';
import { z } from 'zod';

const projectSchema = z.object({
  clientId: z.string().uuid().optional(),
  title: z.string().min(3),
  description: z.string().min(10),
  service: z.nativeEnum(ServiceType),
  status: z.nativeEnum(ProjectStatus).optional(),
  budget: z.number().positive().optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  deliverables: z.array(z.any()).optional(),
  assignedTeam: z.array(z.any()).optional(),
});

// GET /api/v1/projects
export const getProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const where = isAdmin ? {} : { clientId: req.user?.id };

  const projects = await Project.findAll({
    where,
    include: [{ model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] }],
    order: [['createdAt', 'DESC']],
  });

  return sendResponse(res, { data: projects });
});

// GET /api/v1/projects/:id
export const getProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const project = await Project.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] },
      { model: Quote, as: 'quotes' },
      { model: Invoice, as: 'invoices' },
    ],
  });

  if (!project) return sendError(res, '32', 'Projet non trouvé');
  return sendResponse(res, { data: project });
});

// POST /api/v1/projects
export const createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());

  const isAdmin = req.user?.role === UserRole.ADMIN;
  const clientId = isAdmin ? (parsed.data.clientId || req.user?.id!) : req.user?.id!;
  const { clientId: _ignored, status, ...rest } = parsed.data;

  const project = await Project.create({
    ...rest,
    clientId,
    ...(status ? { status } : {}),
  } as any);
  return sendResponse(res, { responseCode: '01', data: project });
});

// PATCH /api/v1/projects/:id
export const updateProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const project = await Project.findOne({ where });
  if (!project) return sendError(res, '32', 'Projet non trouvé');

  await project.update(req.body);
  return sendResponse(res, { responseCode: '02', data: project });
});

// DELETE /api/v1/projects/:id (Admin only)
export const deleteProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const project = await Project.findByPk(String(req.params.id));
  if (!project) return sendError(res, '32', 'Projet non trouvé');

  await project.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
