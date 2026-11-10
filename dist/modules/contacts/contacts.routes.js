"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const create_controller_1 = require("./create/create.controller");
const list_controller_1 = require("./list/list.controller");
const update_controller_1 = require("./update/update.controller");
const delete_controller_1 = require("./delete/delete.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const user_enum_1 = require("../../enums/user.enum");
const contactsRouter = (0, express_1.Router)();
const contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { responseCode: '98', responseMessage: 'Trop de messages envoyés, réessayez dans 1 heure.' },
});
contactsRouter.post('/', contactLimiter, create_controller_1.createContactRequest);
contactsRouter.get('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]), list_controller_1.getContactRequests);
contactsRouter.patch('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]), update_controller_1.updateContactStatus);
contactsRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]), delete_controller_1.deleteContactRequest);
exports.default = contactsRouter;
