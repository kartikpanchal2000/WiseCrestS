import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
	createTask,
	getTasks,
	getTask,
	updateTask,
	deleteTask,
} from '../controllers/task.controller';

const router = Router();

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
