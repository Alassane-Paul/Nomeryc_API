"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const list_controller_1 = require("./list/list.controller");
const admin_list_controller_1 = require("./admin-list/admin-list.controller");
const get_controller_1 = require("./get/get.controller");
const create_controller_1 = require("./create/create.controller");
const update_controller_1 = require("./update/update.controller");
const delete_controller_1 = require("./delete/delete.controller");
const add_comment_controller_1 = require("./add-comment/add-comment.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const user_enum_1 = require("../../enums/user.enum");
const blogRouter = (0, express_1.Router)();
// Routes publiques
blogRouter.get('/', list_controller_1.getPosts);
blogRouter.get('/:slug', get_controller_1.getPost);
blogRouter.post('/:slug/comment', add_comment_controller_1.addComment);
// Routes Admin
blogRouter.get('/admin/all', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]), admin_list_controller_1.getAllPosts);
blogRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]), create_controller_1.createPost);
blogRouter.patch('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]), update_controller_1.updatePost);
blogRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]), delete_controller_1.deletePost);
exports.default = blogRouter;
