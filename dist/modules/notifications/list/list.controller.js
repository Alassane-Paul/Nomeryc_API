"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const list_service_1 = require("./list.service");
exports.getNotifications = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    return (0, response_1.sendResponse)(res, { data: await (0, list_service_1.listNotificationsService)(req.user?.id, req.query) });
});
