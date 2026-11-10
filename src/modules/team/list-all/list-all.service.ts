import { TeamMember } from '../../../models/teamMember.model';

export async function listAllTeamMembers() {
  return TeamMember.findAll({ order: [['orderIndex', 'ASC']] });
}
