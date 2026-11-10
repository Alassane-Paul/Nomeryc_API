"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fedapayWebhook = fedapayWebhook;
const fedapay_service_1 = require("./fedapay.service");
async function fedapayWebhook(req, res) {
    const signature = req.headers['x-fedapay-signature'];
    const result = await (0, fedapay_service_1.processFedapayWebhook)(req.body, typeof signature === 'string' ? signature : undefined);
    return res.status(result.status).json(result.payload);
}
