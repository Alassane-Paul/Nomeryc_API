"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSingleUpload = formatSingleUpload;
const upload_1 = require("../../../config/upload");
function formatSingleUpload(file) {
    return file ? (0, upload_1.formatUploadedFile)(file) : null;
}
