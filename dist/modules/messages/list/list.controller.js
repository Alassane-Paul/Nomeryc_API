"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const list_service_1 = require("./list.service");
exports.getMessages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, list_service_1.listMessagesService)(req.user?.id, req.user?.role, req.query);
    if ('error' in result)
        return (0, response_1.sendError)(res, '11', result.error);
    return (0, response_1.sendResponse)(res, { data: result.messages });
});
