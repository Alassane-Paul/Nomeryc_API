"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = stripeWebhook;
const stripe_service_1 = require("./stripe.service");
async function stripeWebhook(req, res) {
    const signature = req.headers['stripe-signature'];
    const result = await (0, stripe_service_1.processStripeWebhook)(req.body, typeof signature === 'string' ? signature : undefined);
    return res.status(result.status).json(result.payload);
}
