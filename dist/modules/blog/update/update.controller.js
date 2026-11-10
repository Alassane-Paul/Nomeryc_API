"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updatePost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const post = await (0, update_service_1.updatePostService)(String(req.params.id), req.body);
    if (!post)
        return (0, response_1.sendError)(res, '30', 'Article non trouvé');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: post });
});
