import { Project } from '../../../models/project.model';

export async function deleteProject(id: string) {
  const project = await Project.findByPk(id);
  if (!project) return false;
  await project.destroy();
  return true;
}
