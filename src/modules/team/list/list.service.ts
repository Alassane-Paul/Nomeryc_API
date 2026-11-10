import { TeamMember } from '../../../models/teamMember.model';

export async function listTeamMembers() {
  return TeamMember.findAll({
    where: { isPublic: true },
    order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
  });
}
