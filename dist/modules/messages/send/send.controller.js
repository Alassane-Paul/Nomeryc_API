"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const send_service_1 = require("./send.service");
exports.sendMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, send_service_1.sendMessageService)(req.user, req.body);
    if ('error' in result)
        return (0, response_1.sendError)(res, '11', result.error);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: result.message });
});
