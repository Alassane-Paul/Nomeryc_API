"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const upload_single_service_1 = require("./upload-single.service");
exports.uploadSingle = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const file = (0, upload_single_service_1.formatSingleUpload)(req.file);
    if (!file)
        return (0, response_1.sendError)(res, '11', 'Aucun fichier fourni');
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: file });
});
