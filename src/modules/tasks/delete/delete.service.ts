import { Task } from '../../../models/task.model';

export async function deleteTask(id: string) {
  const task = await Task.findByPk(id);
  if (!task) return false;
  await task.destroy();
  return true;
}
