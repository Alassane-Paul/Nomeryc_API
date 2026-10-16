import path from 'path';
import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dialect = (process.env.DB_DIALECT || 'sqlite') as 'sqlite' | 'mysql' | 'postgres';
const isSqlite = dialect === 'sqlite';

const config: Options = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  ...(isSqlite
    ? {
        storage: path.resolve(
          process.cwd(),
          process.env.DB_STORAGE || process.env.DB_NAME || 'database.sqlite'
        ),
      }
    : {}),
};

export const sequelize = new Sequelize(config);

export default sequelize;
