"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const read_all_service_1 = require("./read-all.service");
exports.markAllAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await (0, read_all_service_1.markAllNotificationsReadService)(req.user?.id);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: null });
});
