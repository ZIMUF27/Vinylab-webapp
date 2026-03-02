import { Router } from 'express';
import { DesignController } from '../controllers/design.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const designController = new DesignController();

router.post('/', authenticateJWT, designController.create);
router.get('/my', authenticateJWT, designController.getMyDesigns);
router.get('/:id', authenticateJWT, designController.getById);

export default router;
