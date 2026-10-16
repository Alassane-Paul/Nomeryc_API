import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database';
import { initModels } from '../models/index';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';
import { Quote } from '../models/quote.model';
import { Invoice } from '../models/invoice.model';
import { BlogPost } from '../models/blogPost.model';
import { PortfolioItem } from '../models/portfolioItem.model';
import { TeamMember } from '../models/teamMember.model';
import { Testimonial } from '../models/testimonial.model';
import { Faq } from '../models/faq.model';
import { PricingPlan } from '../models/pricingPlan.model';
import { Message } from '../models/message.model';
import { UserRole } from '../enums/user.enum';
import { ProjectStatus } from '../enums/projet.enum';
import { ServiceType } from '../enums/service.enum';
import { QuoteStatus } from '../enums/quote.enum';
import { InvoiceStatus } from '../enums/invoice.enum';
import { BlogPostStatus } from '../enums/blogPost.enum';

async function seed() {
  try {
    console.log('🌱 Démarrage du seed de la base de données Nomeryc...');

    await sequelize.authenticate();
    initModels(sequelize);
    await sequelize.sync({ force: true });
    console.log('✅ Base de données réinitialisée.');

    // 1. Mot de passe
    const hashedPassword = await bcrypt.hash('Nomeryc2026!', 10);

    // 2. Utilisateurs
    const admin = await User.create({
      email: 'admin@nomeryc.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      firstName: 'Alassane',
      lastName: 'Paul',
      phone: '+33 1 89 00 00 00',
      company: 'Nomeryc Agency',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: 'active',
    });

    const client = await User.create({
      email: 'client@nomeryc.com',
      password: hashedPassword,
      role: UserRole.CLIENT,
      firstName: 'Amadou',
      lastName: 'Sow',
      phone: '+33 6 12 34 56 78',
      company: 'TechSolutions SARL',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      status: 'active',
    });

    const adminId = admin.getDataValue('id');
    const clientId = client.getDataValue('id');

    console.log('✅ Utilisateurs créés (admin@nomeryc.com / client@nomeryc.com - MDP: Nomeryc2026!).');

    // 3. Projets
    // const project1 = await Project.create({
    //   clientId,
    //   title: 'Refonte Site E-Commerce Nomeryc',
    //   description: 'Modernisation de l’infrastructure web sous React & TypeScript avec intégration paiement.',
    //   service: ServiceType.WEB,
    //   status: ProjectStatus.EN_COURS,
    //   budget: 4500,
    //   startDate: new Date('2026-02-01'),
    //   deadline: new Date('2026-04-15'),
    // } as any);

    // const project2 = await Project.create({
    //   clientId,
    //   title: 'Application Mobile Compagnon',
    //   description: 'Application iOS et Android pour les clients finaux avec notifications push.',
    //   service: ServiceType.APPS,
    //   status: ProjectStatus.REVISION,
    //   budget: 6800,
    //   startDate: new Date('2026-01-10'),
    //   deadline: new Date('2026-03-25'),
    // } as any);

    // const project1Id = project1.getDataValue('id');
    // const project2Id = project2.getDataValue('id');

    // console.log('✅ Projets créés.');

    // // 4. Devis
    // await Quote.create({
    //   clientId,
    //   quoteNumber: 'DEV-2026-0001',
    //   title: 'Pack Vitrine Starter & Identité',
    //   totalHT: 2075,
    //   tvaRate: 20,
    //   totalTVA: 415,
    //   totalTTC: 2490,
    //   status: QuoteStatus.ENVOYE,
    //   validUntil: new Date('2026-04-30'),
    // } as any);

    // console.log('✅ Devis créés.');

    // // 5. Factures
    // await Invoice.create({
    //   invoiceNumber: 'FAC-2026-0001',
    //   clientId,
    //   projectId: project1Id,
    //   title: 'Acompte 50% - Refonte Site E-Commerce',
    //   totalHT: 2250,
    //   tvaRate: 20,
    //   totalTVA: 450,
    //   totalTTC: 2700,
    //   status: InvoiceStatus.PAYE,
    //   dueDate: new Date('2026-02-15'),
    //   paidAt: new Date('2026-02-10'),
    // } as any);

    // await Invoice.create({
    //   invoiceNumber: 'FAC-2026-0002',
    //   clientId,
    //   projectId: project2Id,
    //   title: 'Acompte 50% - Application Mobile',
    //   totalHT: 3400,
    //   tvaRate: 20,
    //   totalTVA: 680,
    //   totalTTC: 4080,
    //   status: InvoiceStatus.ENVOYE,
    //   dueDate: new Date('2026-03-31'),
    // } as any);

    // console.log('✅ Factures créées.');

    // // 6. Blog
    // await BlogPost.create({
    //   authorId: adminId,
    //   title: 'Pourquoi migrer vers une architecture TypeScript en 2026',
    //   slug: 'pourquoi-migrer-architecture-typescript-2026',
    //   excerpt: 'Sécurité de typage, productivité décuplée et maintenance facilitée pour les équipes web.',
    //   content: 'TypeScript est devenu le standard incontournable pour le développement web moderne...',
    //   category: 'Ingénierie Web',
    //   status: BlogPostStatus.PUBLIE,
    //   coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    //   publishedAt: new Date(),
    // } as any);

    // console.log('✅ Blog créé.');

    // // 7. Portfolio
    // await PortfolioItem.create({
    //   title: 'Plateforme E-Commerce Omnicanale',
    //   description: 'Boutique en ligne haute performance avec synchronisation ERP en temps réel.',
    //   category: 'web',
    //   clientName: 'Maison Luxe',
    //   liveUrl: 'https://example.com',
    //   featured: true,
    //   coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    //   images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60'],
    //   technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS'],
    // } as any);

    // console.log('✅ Portfolio créé.');

    // // 7bis. Équipe
    // await TeamMember.bulkCreate([
    //   {
    //     name: 'Alassane Paul',
    //     role: 'Fondateur & Lead Architect',
    //     bio: 'Ingénieur logiciel passionné par les systèmes distribués, l’écosystème TypeScript et le cloud.',
    //     avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    //     orderIndex: 0,
    //   },
    //   {
    //     name: 'Sarah Mendy',
    //     role: 'Head of Design & UX',
    //     bio: 'Experte en ergonomie digitale, ergonomie cognitive et création de design systems Figma scalables.',
    //     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    //     orderIndex: 1,
    //   },
    //   {
    //     name: 'Karim Diallo',
    //     role: 'Lead Mobile & DevOps',
    //     bio: 'Spécialiste React Native, Flutter et pipelines CI/CD haute disponibilité.',
    //     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    //     orderIndex: 2,
    //   },
    // ] as any);

    // console.log('✅ Équipe créée.');

    // // 7ter. Témoignages
    // await Testimonial.bulkCreate([
    //   {
    //     name: 'Kofi Asante',
    //     role: 'CEO, TechLokal',
    //     content: 'Nomeryc a transformé notre vision en une plateforme exceptionnelle. Professionnels, réactifs et créatifs !',
    //     initials: 'KA',
    //     rating: 5,
    //     orderIndex: 0,
    //   },
    //   {
    //     name: 'Adaora Obi',
    //     role: 'DG, ShopAfrica',
    //     content: 'Notre e-commerce a vu ses ventes doubler grâce à leur expertise technique et design irréprochable.',
    //     initials: 'AO',
    //     rating: 5,
    //     orderIndex: 1,
    //   },
    //   {
    //     name: 'Seydou Diallo',
    //     role: 'Fondateur, FinPay',
    //     content: "L'équipe a livré notre app mobile en temps record avec une qualité qui dépasse nos attentes.",
    //     initials: 'SD',
    //     rating: 5,
    //     orderIndex: 2,
    //   },
    // ] as any);

    // console.log('✅ Témoignages créés.');

    // // 7quater. FAQ
    // await Faq.bulkCreate([
    //   {
    //     question: 'Comment se déroule le paiement de mon projet ?',
    //     answer: 'Nos projets fonctionnent généralement avec un acompte de 40% au lancement, 30% après validation des maquettes UI/UX, et le solde de 30% à la livraison et mise en ligne.',
    //     orderIndex: 0,
    //   },
    //   {
    //     question: "Puis-je modifier moi-même le contenu de mon site plus tard ?",
    //     answer: "Absolument ! Tous nos sites sont livrés avec un panneau d'administration ergonomique vous permettant de gérer vos textes, articles de blog, images et projets en toute autonomie.",
    //     orderIndex: 1,
    //   },
    //   {
    //     question: 'Suis-je propriétaire de mon code source et de mon nom de domaine ?',
    //     answer: "Oui, à 100%. Dès le règlement final de la prestation, vous êtes l'unique propriétaire de l'intégralité des créations, codes sources, licences et visuels conçus pour vous.",
    //     orderIndex: 2,
    //   },
    //   {
    //     question: 'Proposez-vous un contrat de maintenance après le lancement ?',
    //     answer: 'Oui, nous proposons des formules de maintenance mensuelle (sauvegardes, veille de sécurité, mises à jour, petites modifications) adaptées à chaque volume de trafic.',
    //     orderIndex: 3,
    //   },
    // ] as any);

    // console.log('✅ FAQ créée.');

    // // 7quinquies. Offres tarifaires
    // await PricingPlan.bulkCreate([
    //   {
    //     name: 'Pack Vitrine Starter',
    //     badge: 'Idéal Lancement',
    //     price: '990',
    //     currency: '€',
    //     period: 'paiement unique',
    //     description: 'Une présence en ligne percutante et optimisée pour lancer votre activité avec élégance.',
    //     features: [
    //       "Site web moderne (jusqu'à 5 pages)",
    //       'Design responsive mobile, tablette & desktop',
    //       'Formulaire de contact & intégration WhatsApp',
    //       'Optimisation SEO de base & Google My Business',
    //       'Hébergement & certificat SSL sécurisé 1 an',
    //       'Livraison rapide en 10 jours ouvrés',
    //     ],
    //     highlighted: false,
    //     ctaText: "Choisir l'offre Starter",
    //     ctaLink: '/contact?plan=starter',
    //     orderIndex: 0,
    //   },
    //   {
    //     name: 'Pack Business Pro',
    //     badge: 'Le Plus Populaire',
    //     price: '2 490',
    //     currency: '€',
    //     period: 'paiement unique',
    //     description: 'Pour les entreprises établies souhaitant convertir plus de prospects et automatiser leurs processus.',
    //     features: [
    //       'Architecture sur-mesure React / TypeScript',
    //       'Pages illimitées et blog administrable',
    //       'Espace client sécurisé ou fonctionnalités SaaS',
    //       'Intégration CRM, Stripe ou Mobile Money',
    //       'Optimisation SEO sémantique avancée',
    //       'Formation complète de votre équipe',
    //       'Support & maintenance offerts 3 mois',
    //     ],
    //     highlighted: true,
    //     ctaText: 'Démarrer avec le pack Pro',
    //     ctaLink: '/contact?plan=pro',
    //     orderIndex: 1,
    //   },
    //   {
    //     name: 'Pack Sur-Mesure Enterprise',
    //     badge: 'Grands Comptes',
    //     price: 'Sur devis',
    //     currency: '',
    //     period: 'selon cahier des charges',
    //     description: 'Applications web complexes, plateformes logicielles multi-rôles et écosystèmes mobiles dédiés.',
    //     features: [
    //       'Applications mobiles iOS & Android cross-platform',
    //       'Systèmes distribués haute charge & APIs complexes',
    //       'Design System complet sous Figma',
    //       'Audit de sécurité & conformité RGPD',
    //       'DevOps, CI/CD et infrastructure cloud dédiée',
    //       'Chef de projet dédié & SLA garanti < 2h',
    //     ],
    //     highlighted: false,
    //     ctaText: 'Demander un devis sur-mesure',
    //     ctaLink: '/contact?plan=enterprise',
    //     orderIndex: 2,
    //   },
    // ] as any);

    // console.log('✅ Offres tarifaires créées.');

    // // 8. Messages
    // await Message.create({
    //   senderId: adminId,
    //   recipientId: clientId,
    //   projectId: project1Id,
    //   content: 'Bonjour Amadou, nous avons finalisé la première maquette responsive !',
    //   isRead: true,
    // } as any);

    // console.log('✅ Message créé.');

    console.log('\n🎉 Base de données Nomeryc initialisée et peuplée avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err);
    process.exit(1);
  }
}

seed();
