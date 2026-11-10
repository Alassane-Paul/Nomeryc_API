"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dialect = (process.env.DB_DIALECT || 'sqlite');
const isSqlite = dialect === 'sqlite';
const config = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    ...(isSqlite
        ? {
            storage: path_1.default.resolve(process.cwd(), process.env.DB_STORAGE || process.env.DB_NAME || 'database.sqlite'),
        }
        : {}),
};
exports.sequelize = new sequelize_1.Sequelize(config);
exports.default = exports.sequelize;
