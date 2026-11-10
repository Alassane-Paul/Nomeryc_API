"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPortfolioItem = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const create_service_1 = require("./create.service");
exports.createPortfolioItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: await (0, create_service_1.createPortfolioItemService)(req.body) });
});
