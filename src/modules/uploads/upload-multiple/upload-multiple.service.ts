import { formatUploadedFile } from '../../../config/upload';

export function formatMultipleUploads(files: Express.Multer.File[] | undefined) {
  return files && files.length > 0 ? files.map(formatUploadedFile) : null;
}
