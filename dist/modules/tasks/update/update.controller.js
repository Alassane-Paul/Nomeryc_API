"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updateTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = update_service_1.taskUpdateSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const task = await (0, update_service_1.updateTask)(String(req.params.id), parsed.data);
    if (!task)
        return (0, response_1.sendError)(res, '30', 'Tâche non trouvée');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: task });
});
