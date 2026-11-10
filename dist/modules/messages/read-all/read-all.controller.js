"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const read_all_service_1 = require("./read-all.service");
exports.markAllAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!await (0, read_all_service_1.markAllMessagesReadService)(req.user, req.body, req.query))
        return (0, response_1.sendError)(res, '11', 'clientId requis');
    return (0, response_1.sendResponse)(res, { responseMessage: 'Tous les messages marqués comme lus', data: null });
});
