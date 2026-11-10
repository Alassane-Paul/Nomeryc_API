import { TeamMember } from '../../../models/teamMember.model';

export async function deleteTeamMember(id: string) {
  const member = await TeamMember.findByPk(id);
  if (!member) return false;
  await member.destroy();
  return true;
}
