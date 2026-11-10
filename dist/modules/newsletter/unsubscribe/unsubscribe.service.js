"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribeService = unsubscribeService;
const newsletterSubscriber_model_1 = require("../../../models/newsletterSubscriber.model");
async function unsubscribeService(body, query) {
    const token = String(body.token || query.token || '');
    if (!token)
        return 'missing-token';
    const subscriber = await newsletterSubscriber_model_1.NewsletterSubscriber.findOne({ where: { unsubscribeToken: token } });
    if (!subscriber)
        return 'not-found';
    await subscriber.update({ isActive: false });
    return 'ok';
}
