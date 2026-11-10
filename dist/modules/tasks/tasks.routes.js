"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const list_controller_1 = require("./list/list.controller");
const create_controller_1 = require("./create/create.controller");
const update_controller_1 = require("./update/update.controller");
const delete_controller_1 = require("./delete/delete.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const user_enum_1 = require("../../enums/user.enum");
const tasksRouter = (0, express_1.Router)();
// Les tâches sont un outil interne : réservées aux admins.
tasksRouter.use(auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]));
tasksRouter.get('/', list_controller_1.getTasks);
tasksRouter.post('/', create_controller_1.createTask);
tasksRouter.patch('/:id', update_controller_1.updateTask);
tasksRouter.delete('/:id', delete_controller_1.deleteTask);
exports.default = tasksRouter;
