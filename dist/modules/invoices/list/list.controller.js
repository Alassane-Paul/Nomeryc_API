"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoices = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const list_service_1 = require("./list.service");
exports.getInvoices = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const invoices = await (0, list_service_1.listInvoicesService)(req.user?.id, req.user?.role);
    return (0, response_1.sendResponse)(res, { data: invoices });
});
