"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const read_service_1 = require("./read.service");
exports.markAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const notification = await (0, read_service_1.markNotificationReadService)(String(req.params.id), req.user?.id);
    if (!notification)
        return (0, response_1.sendError)(res, '30', 'Notification non trouvée');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: notification });
});
