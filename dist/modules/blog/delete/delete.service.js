"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostService = deletePostService;
const blogPost_model_1 = require("../../../models/blogPost.model");
async function deletePostService(id) {
    const post = await blogPost_model_1.BlogPost.findByPk(id);
    if (!post)
        return false;
    await post.destroy();
    return true;
}
