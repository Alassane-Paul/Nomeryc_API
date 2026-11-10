"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const delete_service_1 = require("./delete.service");
exports.deleteNotification = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!await (0, delete_service_1.deleteNotificationService)(String(req.params.id), req.user?.id))
        return (0, response_1.sendError)(res, '30', 'Notification non trouvée');
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
