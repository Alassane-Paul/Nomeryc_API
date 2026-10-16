import { Sequelize } from 'sequelize';
import { initUserModel, User } from './user.model';
import { initProjectModel, Project } from './project.model';
import { initQuoteModel, Quote, initQuoteItemModel, QuoteItem } from './quote.model';
import { initInvoiceModel, Invoice, initInvoiceItemModel, InvoiceItem } from './invoice.model';
import { initMessageModel, Message } from './message.model';
import { initBlogPostModel, BlogPost } from './blogPost.model';
import { initPortfolioItemModel, PortfolioItem } from './portfolioItem.model';
import { initContactRequestModel, ContactRequest } from './contactRequest.model';
import { initNotificationModel, Notification } from './notification.model';
import { initTeamMemberModel, TeamMember } from './teamMember.model';
import { initTestimonialModel, Testimonial } from './testimonial.model';
import { initNewsletterSubscriberModel, NewsletterSubscriber } from './newsletterSubscriber.model';
import { initFaqModel, Faq } from './faq.model';
import { initPricingPlanModel, PricingPlan } from './pricingPlan.model';
import { initTaskModel, Task } from './task.model';
import { initDocumentModel, Document } from './document.model';

export interface DbModels {
  User: typeof User;
  Project: typeof Project;
  Quote: typeof Quote;
  QuoteItem: typeof QuoteItem;
  Invoice: typeof Invoice;
  InvoiceItem: typeof InvoiceItem;
  Message: typeof Message;
  BlogPost: typeof BlogPost;
  PortfolioItem: typeof PortfolioItem;
  ContactRequest: typeof ContactRequest;
  Notification: typeof Notification;
  TeamMember: typeof TeamMember;
  Testimonial: typeof Testimonial;
  NewsletterSubscriber: typeof NewsletterSubscriber;
  Faq: typeof Faq;
  PricingPlan: typeof PricingPlan;
  Task: typeof Task;
  Document: typeof Document;
  sequelize: Sequelize;
}

export function initModels(sequelize: Sequelize): DbModels {
  // Initialisation des modèles
  initUserModel(sequelize);
  initProjectModel(sequelize);
  initQuoteModel(sequelize);
  initQuoteItemModel(sequelize);
  initInvoiceModel(sequelize);
  initInvoiceItemModel(sequelize);
  initMessageModel(sequelize);
  initBlogPostModel(sequelize);
  initPortfolioItemModel(sequelize);
  initContactRequestModel(sequelize);
  initNotificationModel(sequelize);
  initTeamMemberModel(sequelize);
  initTestimonialModel(sequelize);
  initNewsletterSubscriberModel(sequelize);
  initFaqModel(sequelize);
  initPricingPlanModel(sequelize);
  initTaskModel(sequelize);
  initDocumentModel(sequelize);

  // ========== ASSOCIATIONS ==========

  // User → Projects
  User.hasMany(Project, { foreignKey: 'clientId', as: 'projects' });
  Project.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

  // User → Quotes
  User.hasMany(Quote, { foreignKey: 'clientId', as: 'quotes' });
  Quote.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

  // Project → Quotes
  Project.hasMany(Quote, { foreignKey: 'projectId', as: 'quotes' });
  Quote.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

  // Quote → QuoteItems
  Quote.hasMany(QuoteItem, { foreignKey: 'quoteId', as: 'items', onDelete: 'CASCADE' });
  QuoteItem.belongsTo(Quote, { foreignKey: 'quoteId', as: 'quote' });

  // User → Invoices
  User.hasMany(Invoice, { foreignKey: 'clientId', as: 'invoices' });
  Invoice.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

  // Project → Invoices
  Project.hasMany(Invoice, { foreignKey: 'projectId', as: 'invoices' });
  Invoice.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

  // Quote → Invoices
  Quote.hasMany(Invoice, { foreignKey: 'quoteId', as: 'invoices' });
  Invoice.belongsTo(Quote, { foreignKey: 'quoteId', as: 'quote' });

  // Invoice → InvoiceItems
  Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });
  InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

  // Messages
  User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
  User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });
  Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
  Project.hasMany(Message, { foreignKey: 'projectId', as: 'messages' });
  Message.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

  // Blog
  User.hasMany(BlogPost, { foreignKey: 'authorId', as: 'blogPosts' });
  BlogPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

  // Notifications
  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Tasks
  Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
  Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
  User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });
  Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

  // Documents
  User.hasMany(Document, { foreignKey: 'clientId', as: 'documents', onDelete: 'CASCADE' });
  Document.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
  Document.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploadedBy' });
  Project.hasMany(Document, { foreignKey: 'projectId', as: 'documents' });
  Document.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

  return {
    User,
    Project,
    Quote,
    QuoteItem,
    Invoice,
    InvoiceItem,
    Message,
    BlogPost,
    PortfolioItem,
    ContactRequest,
    Notification,
    TeamMember,
    Testimonial,
    Faq,
    PricingPlan,
    Task,
    Document,
    NewsletterSubscriber,
    sequelize,
  };
}

// Exporter les modèles individuellement pour les imports directs
export {
  User,
  Project,
  Quote,
  QuoteItem,
  Invoice,
  InvoiceItem,
  Message,
  BlogPost,
  PortfolioItem,
  ContactRequest,
  Notification,
  TeamMember,
  Testimonial,
  Faq,
  PricingPlan,
  Task,
  Document,
  NewsletterSubscriber,
};
