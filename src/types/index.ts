export type UserRole = 'ADMIN' | 'CLIENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface IUser {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  avatar?: string;
  status: UserStatus;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ServiceType = 'WEB' | 'APPS' | 'AUDIT' | 'DESIGN' | 'BOT';

export type ProjectStatus = 'QUOTE' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';

export interface IProject {
  id: string;
  clientId: string;
  title: string;
  description: string;
  service: ServiceType;
  status: ProjectStatus;
  budget: number;
  progress: number;
  startDate?: string | Date;
  deadline?: string | Date;
  deliverables?: Array<{ id: string; title: string; status: 'PENDING' | 'DONE'; url?: string }>;
  assignedTeam?: Array<{ name: string; role: string; avatar?: string }>;
  client?: Partial<IUser>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';

export interface IQuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IQuote {
  id: string;
  projectId?: string;
  clientId: string;
  quoteNumber: string;
  items: IQuoteItem[];
  totalHT: number;
  tvaRate: number;
  totalTTC: number;
  status: QuoteStatus;
  validUntil: string | Date;
  terms?: string;
  client?: Partial<IUser>;
  project?: Partial<IProject>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface IInvoice {
  id: string;
  quoteId?: string;
  projectId?: string;
  clientId: string;
  invoiceNumber: string;
  items: IQuoteItem[];
  totalHT: number;
  totalTTC: number;
  status: InvoiceStatus;
  dueDate: string | Date;
  paidAt?: string | Date | null;
  paymentMethod?: string;
  client?: Partial<IUser>;
  project?: Partial<IProject>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  id: string;
  projectId?: string;
  senderId: string;
  recipientId?: string;
  content: string;
  attachments?: Array<{ name: string; url: string; size?: string; type?: string }>;
  isRead: boolean;
  sender?: Partial<IUser>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface IBlogPost {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: string;
  status: BlogPostStatus;
  views: number;
  readTimeMinutes: number;
  author?: Partial<IUser>;
  comments?: Array<{ id: string; authorName: string; content: string; createdAt: Date }>;
  publishedAt?: Date | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  coverImage?: string;
  technologies: string[];
  clientName: string;
  liveUrl?: string;
  featured: boolean;
  isPublic: boolean;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ContactStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';

export interface IContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: ServiceType;
  budget?: number;
  message: string;
  status: ContactStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWhatsAppConversation {
  id: string;
  phoneNumber: string;
  userId?: string;
  messages: Array<{
    id: string;
    sender: 'USER' | 'BOT';
    text: string;
    timestamp: Date | string;
  }>;
  status: 'ACTIVE' | 'CLOSED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'PROJECT' | 'INVOICE' | 'MESSAGE' | 'SYSTEM';
  isRead: boolean;
  link?: string;
  createdAt?: Date;
}

export interface IApiResponse<T = any> {
  responseCode: string;
  responseMessage: string;
  data: T | null;
  error?: any;
  timestamp: string;
}
