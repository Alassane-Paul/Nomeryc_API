import { TeamMember } from '../../../models/teamMember.model';

export async function createTeamMember(data: any) {
  return TeamMember.create(data);
}
