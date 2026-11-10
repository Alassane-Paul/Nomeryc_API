"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const create_service_1 = require("./create.service");
exports.createPost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const post = await (0, create_service_1.createPostService)(req.body, req.user.id);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: post });
});
