"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const admin_list_service_1 = require("./admin-list.service");
exports.getAllPosts = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const data = await (0, admin_list_service_1.getAllPostsService)();
    return (0, response_1.sendResponse)(res, { data });
});
