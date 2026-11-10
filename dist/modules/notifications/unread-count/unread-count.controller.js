"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const unread_count_service_1 = require("./unread-count.service");
exports.getUnreadCount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    return (0, response_1.sendResponse)(res, { data: { count: await (0, unread_count_service_1.countUnreadNotificationsService)(req.user?.id) } });
});
