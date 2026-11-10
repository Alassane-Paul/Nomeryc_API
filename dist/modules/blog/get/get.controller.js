"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPost = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const get_service_1 = require("./get.service");
exports.getPost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const post = await (0, get_service_1.getPostService)(req.params.slug);
    if (!post)
        return (0, response_1.sendError)(res, '30', 'Article non trouvé');
    return (0, response_1.sendResponse)(res, { data: post });
});
