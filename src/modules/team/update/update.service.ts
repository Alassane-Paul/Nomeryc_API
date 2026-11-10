import { TeamMember } from '../../../models/teamMember.model';

export async function updateTeamMember(id: string, data: any) {
  const member = await TeamMember.findByPk(id);
  if (!member) return null;
  await member.update(data);
  return member;
}
