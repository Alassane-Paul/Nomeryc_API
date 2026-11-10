"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoicePdf = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const pdf_service_1 = require("../../../services/pdf.service");
const pdf_service_2 = require("./pdf.service");
exports.getInvoicePdf = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const invoice = await (0, pdf_service_2.getInvoicePdfService)(String(req.params.id), req.user?.id, req.user?.role);
    if (!invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    (0, pdf_service_1.streamDocumentPdf)(res, {
        kind: 'Facture', number: invoice.invoiceNumber, date: invoice.createdAt,
        validUntilOrDueDate: invoice.dueDate, validUntilOrDueLabel: 'Échéance', status: invoice.status,
        client: invoice.client, items: invoice.items,
        totalHT: invoice.totalHT, totalTVA: invoice.totalTVA, tvaRate: invoice.tvaRate,
        totalTTC: invoice.totalTTC, notes: invoice.notes,
    });
});
