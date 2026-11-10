"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const conversations_service_1 = require("./conversations.service");
exports.getConversations = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    return (0, response_1.sendResponse)(res, { data: await (0, conversations_service_1.listConversationsService)() });
});
