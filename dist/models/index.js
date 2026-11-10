"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterSubscriber = exports.Document = exports.Task = exports.PricingPlan = exports.Faq = exports.Testimonial = exports.TeamMember = exports.Notification = exports.ContactRequest = exports.PortfolioItem = exports.BlogPost = exports.Message = exports.InvoiceItem = exports.Invoice = exports.QuoteItem = exports.Quote = exports.Project = exports.User = void 0;
exports.initModels = initModels;
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const project_model_1 = require("./project.model");
Object.defineProperty(exports, "Project", { enumerable: true, get: function () { return project_model_1.Project; } });
const quote_model_1 = require("./quote.model");
Object.defineProperty(exports, "Quote", { enumerable: true, get: function () { return quote_model_1.Quote; } });
Object.defineProperty(exports, "QuoteItem", { enumerable: true, get: function () { return quote_model_1.QuoteItem; } });
const invoice_model_1 = require("./invoice.model");
Object.defineProperty(exports, "Invoice", { enumerable: true, get: function () { return invoice_model_1.Invoice; } });
Object.defineProperty(exports, "InvoiceItem", { enumerable: true, get: function () { return invoice_model_1.InvoiceItem; } });
const message_model_1 = require("./message.model");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return message_model_1.Message; } });
const blogPost_model_1 = require("./blogPost.model");
Object.defineProperty(exports, "BlogPost", { enumerable: true, get: function () { return blogPost_model_1.BlogPost; } });
const portfolioItem_model_1 = require("./portfolioItem.model");
Object.defineProperty(exports, "PortfolioItem", { enumerable: true, get: function () { return portfolioItem_model_1.PortfolioItem; } });
const contactRequest_model_1 = require("./contactRequest.model");
Object.defineProperty(exports, "ContactRequest", { enumerable: true, get: function () { return contactRequest_model_1.ContactRequest; } });
const notification_model_1 = require("./notification.model");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return notification_model_1.Notification; } });
const teamMember_model_1 = require("./teamMember.model");
Object.defineProperty(exports, "TeamMember", { enumerable: true, get: function () { return teamMember_model_1.TeamMember; } });
const testimonial_model_1 = require("./testimonial.model");
Object.defineProperty(exports, "Testimonial", { enumerable: true, get: function () { return testimonial_model_1.Testimonial; } });
const newsletterSubscriber_model_1 = require("./newsletterSubscriber.model");
Object.defineProperty(exports, "NewsletterSubscriber", { enumerable: true, get: function () { return newsletterSubscriber_model_1.NewsletterSubscriber; } });
const faq_model_1 = require("./faq.model");
Object.defineProperty(exports, "Faq", { enumerable: true, get: function () { return faq_model_1.Faq; } });
const pricingPlan_model_1 = require("./pricingPlan.model");
Object.defineProperty(exports, "PricingPlan", { enumerable: true, get: function () { return pricingPlan_model_1.PricingPlan; } });
const task_model_1 = require("./task.model");
Object.defineProperty(exports, "Task", { enumerable: true, get: function () { return task_model_1.Task; } });
const document_model_1 = require("./document.model");
Object.defineProperty(exports, "Document", { enumerable: true, get: function () { return document_model_1.Document; } });
function initModels(sequelize) {
    // Initialisation des modèles
    (0, user_model_1.initUserModel)(sequelize);
    (0, project_model_1.initProjectModel)(sequelize);
    (0, quote_model_1.initQuoteModel)(sequelize);
    (0, quote_model_1.initQuoteItemModel)(sequelize);
    (0, invoice_model_1.initInvoiceModel)(sequelize);
    (0, invoice_model_1.initInvoiceItemModel)(sequelize);
    (0, message_model_1.initMessageModel)(sequelize);
    (0, blogPost_model_1.initBlogPostModel)(sequelize);
    (0, portfolioItem_model_1.initPortfolioItemModel)(sequelize);
    (0, contactRequest_model_1.initContactRequestModel)(sequelize);
    (0, notification_model_1.initNotificationModel)(sequelize);
    (0, teamMember_model_1.initTeamMemberModel)(sequelize);
    (0, testimonial_model_1.initTestimonialModel)(sequelize);
    (0, newsletterSubscriber_model_1.initNewsletterSubscriberModel)(sequelize);
    (0, faq_model_1.initFaqModel)(sequelize);
    (0, pricingPlan_model_1.initPricingPlanModel)(sequelize);
    (0, task_model_1.initTaskModel)(sequelize);
    (0, document_model_1.initDocumentModel)(sequelize);
    // ========== ASSOCIATIONS ==========
    // User → Projects
    user_model_1.User.hasMany(project_model_1.Project, { foreignKey: 'clientId', as: 'projects' });
    project_model_1.Project.belongsTo(user_model_1.User, { foreignKey: 'clientId', as: 'client' });
    // User → Quotes
    user_model_1.User.hasMany(quote_model_1.Quote, { foreignKey: 'clientId', as: 'quotes' });
    quote_model_1.Quote.belongsTo(user_model_1.User, { foreignKey: 'clientId', as: 'client' });
    // Project → Quotes
    project_model_1.Project.hasMany(quote_model_1.Quote, { foreignKey: 'projectId', as: 'quotes' });
    quote_model_1.Quote.belongsTo(project_model_1.Project, { foreignKey: 'projectId', as: 'project' });
    // Quote → QuoteItems
    quote_model_1.Quote.hasMany(quote_model_1.QuoteItem, { foreignKey: 'quoteId', as: 'items', onDelete: 'CASCADE' });
    quote_model_1.QuoteItem.belongsTo(quote_model_1.Quote, { foreignKey: 'quoteId', as: 'quote' });
    // User → Invoices
    user_model_1.User.hasMany(invoice_model_1.Invoice, { foreignKey: 'clientId', as: 'invoices' });
    invoice_model_1.Invoice.belongsTo(user_model_1.User, { foreignKey: 'clientId', as: 'client' });
    // Project → Invoices
    project_model_1.Project.hasMany(invoice_model_1.Invoice, { foreignKey: 'projectId', as: 'invoices' });
    invoice_model_1.Invoice.belongsTo(project_model_1.Project, { foreignKey: 'projectId', as: 'project' });
    // Quote → Invoices
    quote_model_1.Quote.hasMany(invoice_model_1.Invoice, { foreignKey: 'quoteId', as: 'invoices' });
    invoice_model_1.Invoice.belongsTo(quote_model_1.Quote, { foreignKey: 'quoteId', as: 'quote' });
    // Invoice → InvoiceItems
    invoice_model_1.Invoice.hasMany(invoice_model_1.InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });
    invoice_model_1.InvoiceItem.belongsTo(invoice_model_1.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
    // Messages
    user_model_1.User.hasMany(message_model_1.Message, { foreignKey: 'senderId', as: 'sentMessages' });
    message_model_1.Message.belongsTo(user_model_1.User, { foreignKey: 'senderId', as: 'sender' });
    user_model_1.User.hasMany(message_model_1.Message, { foreignKey: 'recipientId', as: 'receivedMessages' });
    message_model_1.Message.belongsTo(user_model_1.User, { foreignKey: 'recipientId', as: 'recipient' });
    project_model_1.Project.hasMany(message_model_1.Message, { foreignKey: 'projectId', as: 'messages' });
    message_model_1.Message.belongsTo(project_model_1.Project, { foreignKey: 'projectId', as: 'project' });
    // Blog
    user_model_1.User.hasMany(blogPost_model_1.BlogPost, { foreignKey: 'authorId', as: 'blogPosts' });
    blogPost_model_1.BlogPost.belongsTo(user_model_1.User, { foreignKey: 'authorId', as: 'author' });
    // Notifications
    user_model_1.User.hasMany(notification_model_1.Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
    notification_model_1.Notification.belongsTo(user_model_1.User, { foreignKey: 'userId', as: 'user' });
    // Tasks
    project_model_1.Project.hasMany(task_model_1.Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
    task_model_1.Task.belongsTo(project_model_1.Project, { foreignKey: 'projectId', as: 'project' });
    user_model_1.User.hasMany(task_model_1.Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });
    task_model_1.Task.belongsTo(user_model_1.User, { foreignKey: 'assigneeId', as: 'assignee' });
    // Documents
    user_model_1.User.hasMany(document_model_1.Document, { foreignKey: 'clientId', as: 'documents', onDelete: 'CASCADE' });
    document_model_1.Document.belongsTo(user_model_1.User, { foreignKey: 'clientId', as: 'client' });
    document_model_1.Document.belongsTo(user_model_1.User, { foreignKey: 'uploadedById', as: 'uploadedBy' });
    project_model_1.Project.hasMany(document_model_1.Document, { foreignKey: 'projectId', as: 'documents' });
    document_model_1.Document.belongsTo(project_model_1.Project, { foreignKey: 'projectId', as: 'project' });
    return {
        User: user_model_1.User,
        Project: project_model_1.Project,
        Quote: quote_model_1.Quote,
        QuoteItem: quote_model_1.QuoteItem,
        Invoice: invoice_model_1.Invoice,
        InvoiceItem: invoice_model_1.InvoiceItem,
        Message: message_model_1.Message,
        BlogPost: blogPost_model_1.BlogPost,
        PortfolioItem: portfolioItem_model_1.PortfolioItem,
        ContactRequest: contactRequest_model_1.ContactRequest,
        Notification: notification_model_1.Notification,
        TeamMember: teamMember_model_1.TeamMember,
        Testimonial: testimonial_model_1.Testimonial,
        Faq: faq_model_1.Faq,
        PricingPlan: pricingPlan_model_1.PricingPlan,
        Task: task_model_1.Task,
        Document: document_model_1.Document,
        NewsletterSubscriber: newsletterSubscriber_model_1.NewsletterSubscriber,
        sequelize,
    };
}
