"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactStatus = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updateContactStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const contact = await (0, update_service_1.updateContactStatusService)(String(req.params.id), req.body);
    if (!contact)
        return (0, response_1.sendError)(res, '30', 'Demande non trouvée');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: contact });
});
