import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { BlogPostStatus } from '../enums/blogPost.enum';

export interface CommentItem {
  id: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: Date | string;
  approved?: boolean;
}

export interface BlogPostAttributes {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  status: BlogPostStatus;
  views?: number;
  readTimeMinutes?: number;
  comments?: CommentItem[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface BlogPostCreationAttributes
  extends Optional<BlogPostAttributes, 'id' | 'coverImage' | 'tags' | 'category' | 'views' | 'readTimeMinutes' | 'comments' | 'publishedAt'> {}

export class BlogPost
  extends Model<BlogPostAttributes, BlogPostCreationAttributes>
  implements BlogPostAttributes
{
  public id!: string;
  public authorId!: string;
  public title!: string;
  public slug!: string;
  public content!: string;
  public excerpt!: string;
  public coverImage?: string;
  public tags?: string[];
  public category?: string;
  public status!: BlogPostStatus;
  public views?: number;
  public readTimeMinutes?: number;
  public comments?: CommentItem[];
  public publishedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initBlogPostModel(sequelize: Sequelize): typeof BlogPost {
  BlogPost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      coverImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(BlogPostStatus)),
        allowNull: false,
        defaultValue: BlogPostStatus.BROUILLON,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      readTimeMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comments: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'blog_posts',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { unique: true, fields: ['slug'] },
        { fields: ['status'] },
        { fields: ['author_id'] },
      ],
    }
  );

  return BlogPost;
}
