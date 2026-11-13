import { formatUploadedFile } from '../../../config/upload';

export function formatSingleUpload(file: Express.Multer.File | undefined) {
  return file ? formatUploadedFile(file) : null;
}
