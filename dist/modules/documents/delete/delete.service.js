"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentService = deleteDocumentService;
const document_model_1 = require("../../../models/document.model");
async function deleteDocumentService(id) {
    const document = await document_model_1.Document.findByPk(id);
    if (!document)
        return false;
    await document.destroy();
    return true;
}
