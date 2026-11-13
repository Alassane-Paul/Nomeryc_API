"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const upload_multiple_service_1 = require("./upload-multiple.service");
exports.uploadMultiple = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const files = (0, upload_multiple_service_1.formatMultipleUploads)(req.files);
    if (!files)
        return (0, response_1.sendError)(res, '11', 'Aucun fichier fourni');
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: files });
});
