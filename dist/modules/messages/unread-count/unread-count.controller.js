"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadMessageCount = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const unread_count_service_1 = require("./unread-count.service");
exports.getUnreadMessageCount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const count = await (0, unread_count_service_1.countUnreadMessagesService)(req.user.id, req.user.role);
    return (0, response_1.sendResponse)(res, { data: { count } });
});
