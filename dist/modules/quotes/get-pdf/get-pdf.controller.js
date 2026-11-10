"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuotePdf = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const pdf_service_1 = require("../../../services/pdf.service");
const get_pdf_service_1 = require("./get-pdf.service");
exports.getQuotePdf = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const quote = await (0, get_pdf_service_1.getQuotePdf)(String(req.params.id), req.user?.id, req.user?.role);
    if (!quote)
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    (0, pdf_service_1.streamDocumentPdf)(res, {
        kind: 'Devis',
        number: quote.quoteNumber,
        date: quote.createdAt,
        validUntilOrDueDate: quote.validUntil,
        validUntilOrDueLabel: 'Valable jusqu\'au',
        status: quote.status,
        client: quote.client,
        items: quote.items,
        totalHT: quote.totalHT,
        totalTVA: quote.totalTVA,
        tvaRate: quote.tvaRate,
        totalTTC: quote.totalTTC,
        notes: quote.notes,
        terms: quote.terms,
    });
});
