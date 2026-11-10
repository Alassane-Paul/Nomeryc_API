import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { Testimonial } from '../../../models/testimonial.model';
import { TeamMember } from '../../../models/teamMember.model';
import { ProjectStatus } from '../../../enums/projet.enum';
import { UserRole } from '../../../enums/user.enum';

export async function getPublicStatsService() {
  const [projectsDelivered, clientsCount, teamSize, testimonials] = await Promise.all([
    Project.count({ where: { status: ProjectStatus.TERMINE } }),
    User.count({ where: { role: UserRole.CLIENT } }),
    TeamMember.count(),
    Testimonial.findAll({ attributes: ['rating'], where: { isPublic: true } }),
  ]);

  const ratings = testimonials.map((testimonial) => testimonial.rating).filter((rating): rating is number => typeof rating === 'number');
  const averageRating =
    ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null;

  return { projectsDelivered, clientsCount, teamSize, averageRating, reviewsCount: ratings.length };
}
