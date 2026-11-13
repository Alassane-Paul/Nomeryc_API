"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMultipleUploads = formatMultipleUploads;
const upload_1 = require("../../../config/upload");
function formatMultipleUploads(files) {
    return files && files.length > 0 ? files.map(upload_1.formatUploadedFile) : null;
}
