import { z } from 'zod';
import { Project } from '../../../models/project.model';
import { UserRole } from '../../../enums/user.enum';
import { ProjectStatus } from '../../../enums/projet.enum';
import { ServiceType } from '../../../enums/service.enum';

export const projectSchema = z.object({
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

export async function createProject(data: z.infer<typeof projectSchema>, userId: string | undefined, role: UserRole | undefined) {
  const clientId = role === UserRole.ADMIN ? (data.clientId || userId!) : userId!;
  const { clientId: _ignored, status, ...rest } = data;
  return Project.create({
    ...rest,
    clientId,
    ...(status ? { status } : {}),
  } as any);
}
