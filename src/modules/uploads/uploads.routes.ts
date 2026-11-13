import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadSingle } from './upload-single/upload-single.controller';
import { uploadMultiple } from './upload-multiple/upload-multiple.controller';
import { deleteUpload } from './delete/delete.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { upload } from '../../config/upload';
import { sendError } from '../../utils/response';
import { UserRole } from '../../enums/user.enum';

const uploadsRouter = Router();
uploadsRouter.use(authMiddleware);

/** Traduit les erreurs multer (taille, type, nombre) en réponse API standard. */
function handleUploadErrors(handler: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') return sendError(res, '12', 'Fichier trop volumineux');
        if (err.code === 'LIMIT_FILE_COUNT') return sendError(res, '12', 'Trop de fichiers (5 maximum)');
        return sendError(res, '12', err.message);
      }
      if (err) return sendError(res, '12', err.message || 'Upload refusé');
      next();
    });
  };
}

uploadsRouter.post('/', handleUploadErrors(upload.single('file')), uploadSingle);
uploadsRouter.post('/multiple', handleUploadErrors(upload.array('files', 5)), uploadMultiple);
uploadsRouter.delete('/:filename', authorizationMiddleware([UserRole.ADMIN]), deleteUpload);

export default uploadsRouter;
