"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocuments = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const list_service_1 = require("./list.service");
exports.getDocuments = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, list_service_1.getDocumentsService)(req.user, req.query);
    return (0, response_1.sendResponse)(res, { data });
});
