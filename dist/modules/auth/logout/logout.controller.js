"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
exports.logout = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    return (0, response_1.sendResponse)(res, {
        responseCode: '00',
        responseMessage: 'Déconnexion réussie',
        data: null,
    });
});
