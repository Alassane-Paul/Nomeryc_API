"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceService = updateInvoiceService;
const invoice_model_1 = require("../../../models/invoice.model");
async function updateInvoiceService(id, body) {
    const invoice = await invoice_model_1.Invoice.findByPk(id);
    if (!invoice)
        return null;
    await invoice.update(body);
    return invoice;
}
