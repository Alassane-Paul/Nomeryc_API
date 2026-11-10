"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUnreadMessagesService = countUnreadMessagesService;
const sequelize_1 = require("sequelize");
const user_enum_1 = require("../../../enums/user.enum");
const message_model_1 = require("../../../models/message.model");
const user_model_1 = require("../../../models/user.model");
async function countUnreadMessagesService(userId, role) {
    if (role === user_enum_1.UserRole.ADMIN) {
        const clients = await user_model_1.User.findAll({
            where: { role: user_enum_1.UserRole.CLIENT },
            attributes: ['id'],
        });
        return message_model_1.Message.count({
            where: {
                senderId: { [sequelize_1.Op.in]: clients.map((client) => client.id) },
                isRead: false,
            },
        });
    }
    return message_model_1.Message.count({
        where: {
            recipientId: userId,
            isRead: false,
        },
    });
}
