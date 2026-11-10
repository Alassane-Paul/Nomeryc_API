"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const list_service_1 = require("./list.service");
exports.getUsers = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const users = await (0, list_service_1.listUsers)();
    return (0, response_1.sendResponse)(res, { data: users });
});
