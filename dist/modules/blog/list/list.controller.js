"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const list_service_1 = require("./list.service");
exports.getPosts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, list_service_1.getPostsService)(req.query);
    return (0, response_1.sendResponse)(res, { data });
});
