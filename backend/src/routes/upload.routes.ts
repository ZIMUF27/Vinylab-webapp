import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const uploadController = new UploadController();

router.post('/', authenticateJWT, upload.single('file'), uploadController.uploadFile);

export default router;
