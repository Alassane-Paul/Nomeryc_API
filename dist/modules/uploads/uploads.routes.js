"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_single_controller_1 = require("./upload-single/upload-single.controller");
const upload_multiple_controller_1 = require("./upload-multiple/upload-multiple.controller");
const delete_controller_1 = require("./delete/delete.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_1 = require("../../config/upload");
const response_1 = require("../../utils/response");
const user_enum_1 = require("../../enums/user.enum");
const uploadsRouter = (0, express_1.Router)();
uploadsRouter.use(auth_middleware_1.authMiddleware);
/** Traduit les erreurs multer (taille, type, nombre) en réponse API standard. */
function handleUploadErrors(handler) {
    return (req, res, next) => {
        handler(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE')
                    return (0, response_1.sendError)(res, '12', 'Fichier trop volumineux');
                if (err.code === 'LIMIT_FILE_COUNT')
                    return (0, response_1.sendError)(res, '12', 'Trop de fichiers (5 maximum)');
                return (0, response_1.sendError)(res, '12', err.message);
            }
            if (err)
                return (0, response_1.sendError)(res, '12', err.message || 'Upload refusé');
            next();
        });
    };
}
uploadsRouter.post('/', handleUploadErrors(upload_1.upload.single('file')), upload_single_controller_1.uploadSingle);
uploadsRouter.post('/multiple', handleUploadErrors(upload_1.upload.array('files', 5)), upload_multiple_controller_1.uploadMultiple);
uploadsRouter.delete('/:filename', (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]), delete_controller_1.deleteUpload);
exports.default = uploadsRouter;
