"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPostsService = getAllPostsService;
const blogPost_model_1 = require("../../../models/blogPost.model");
const user_model_1 = require("../../../models/user.model");
async function getAllPostsService() {
    return blogPost_model_1.BlogPost.findAll({
        include: [{ model: user_model_1.User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
        order: [['createdAt', 'DESC']],
    });
}
