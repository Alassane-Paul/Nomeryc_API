"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const subscribe_service_1 = require("./subscribe.service");
exports.subscribe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, subscribe_service_1.subscribeService)(req.body);
    if ('error' in result)
        return (0, response_1.sendError)(res, '10', 'Email invalide');
    if (result.alreadySubscribed) {
        return (0, response_1.sendResponse)(res, { responseCode: '00', responseMessage: 'Vous êtes déjà inscrit à la newsletter.', data: null });
    }
    return (0, response_1.sendResponse)(res, { responseCode: '01', responseMessage: 'Inscription réussie !', data: null });
});
