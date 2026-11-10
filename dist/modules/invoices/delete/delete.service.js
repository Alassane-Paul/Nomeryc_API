"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoiceService = deleteInvoiceService;
const invoice_model_1 = require("../../../models/invoice.model");
async function deleteInvoiceService(id) {
    const invoice = await invoice_model_1.Invoice.findByPk(id);
    if (!invoice)
        return false;
    await invoice.destroy();
    return true;
}
