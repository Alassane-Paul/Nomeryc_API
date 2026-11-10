"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMember = void 0;
exports.initTeamMemberModel = initTeamMemberModel;
const sequelize_1 = require("sequelize");
class TeamMember extends sequelize_1.Model {
    id;
    name;
    role;
    bio;
    avatar;
    isPublic;
    orderIndex;
    createdAt;
    updatedAt;
}
exports.TeamMember = TeamMember;
function initTeamMemberModel(sequelize) {
    TeamMember.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        bio: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        avatar: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        isPublic: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        orderIndex: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        sequelize,
        tableName: 'team_members',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [{ fields: ['is_public'] }, { fields: ['order_index'] }],
    });
    return TeamMember;
}
