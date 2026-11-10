"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const change_password_service_1 = require("./change-password.service");
exports.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await (0, change_password_service_1.changePassword)(String(req.params.id), req.user?.id, currentPassword, newPassword);
    if ('error' in result && result.error === 'forbidden')
        return (0, response_1.sendError)(res, '23', 'Accès refusé');
    if ('error' in result && result.error === 'missing-password') {
        return (0, response_1.sendError)(res, '11', 'Mot de passe actuel et nouveau requis');
    }
    if ('error' in result && result.error === 'invalid-password')
        return (0, response_1.sendError)(res, '21', 'Mot de passe actuel incorrect');
    if ('error' in result)
        return (0, response_1.sendError)(res, '31', 'Utilisateur non trouvé');
    return (0, response_1.sendResponse)(res, { responseMessage: 'Mot de passe modifié avec succès', data: null });
});
