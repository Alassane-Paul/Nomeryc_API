import { TeamMember } from '../../../models/teamMember.model';

export async function getTeamMember(id: string) {
  return TeamMember.findByPk(id);
}
