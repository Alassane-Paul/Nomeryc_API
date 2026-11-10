"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.initUserModel = initUserModel;
const sequelize_1 = require("sequelize");
const user_enum_1 = require("../enums/user.enum");
class User extends sequelize_1.Model {
}
exports.User = User;
function initUserModel(sequelize) {
    User.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(user_enum_1.UserRole)),
            allowNull: false,
            defaultValue: user_enum_1.UserRole.CLIENT,
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        company: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        avatar: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'suspended'),
            allowNull: false,
            defaultValue: 'active',
        },
        twoFactorEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        twoFactorSecret: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordToken: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'users',
        timestamps: true,
    });
    return User;
}
