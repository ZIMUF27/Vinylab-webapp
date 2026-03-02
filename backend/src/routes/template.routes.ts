import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.guard';

const router = Router();
const templateController = new TemplateController();

router.get('/', templateController.getAll);
router.get('/:id', templateController.getById);

// Admin only
router.post('/', authenticateJWT, roleGuard(['admin']), templateController.create);
router.put('/:id', authenticateJWT, roleGuard(['admin']), templateController.update);
router.delete('/:id', authenticateJWT, roleGuard(['admin']), templateController.delete);

export default router;
