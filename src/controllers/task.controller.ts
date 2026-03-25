import { Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Task } from '../entities/Task';
import { AuthRequest } from '../middlewares/auth.middleware';

const taskRepo = AppDataSource.getRepository(Task);

export const createTask = async (req: AuthRequest, res: Response) => {
	try {
		const { title, description } = req.body;

		if (!title) {
			return res
				.status(400)
				.json({ status: 'error', message: 'Title required' });
		}

		const task = taskRepo.create({
			title,
			description,
			user: { id: req.user.id },
		});

		await taskRepo.save(task);

		return res
			.status(201)
			.json({ status: 'success', message: 'Task created', data: task });
	} catch (err: any) {
		return res.status(500).json({
			status: 'error',
			message: err.message || 'Task creation failed',
		});
	}
};

export const getTasks = async (req: AuthRequest, res: Response) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = 10;

		const [tasks, total] = await taskRepo.findAndCount({
			where: { user: { id: req.user.id } },
			skip: (page - 1) * limit,
			take: limit,
		});

		return res.json({
			status: 'success',
			message: 'Tasks fetched',
			data: { tasks, total },
		});
	} catch (err: any) {
		return res.status(500).json({
			status: 'error',
			message: err.message || 'Failed to fetch tasks',
		});
	}
};

export const getTask = async (req: AuthRequest, res: Response) => {
	try {
		const task = await taskRepo.findOne({
			where: { id: Number(req.params.id), user: { id: req.user.id } },
		});

		if (!task) {
			return res
				.status(404)
				.json({ status: 'error', message: 'Task not found' });
		}

		return res.json({ status: 'success', message: 'Task fetched', data: task });
	} catch (err: any) {
		return res.status(500).json({
			status: 'error',
			message: err.message || 'Failed to fetch task',
		});
	}
};

export const updateTask = async (req: AuthRequest, res: Response) => {
	try {
		const task = await taskRepo.findOne({
			where: { id: Number(req.params.id), user: { id: req.user.id } },
		});

		if (!task)
			return res
				.status(404)
				.json({ status: 'error', message: 'Task not found' });

		Object.assign(task, req.body);
		await taskRepo.save(task);

		return res.json({ status: 'success', message: 'Task updated', data: task });
	} catch (err: any) {
		return res
			.status(500)
			.json({ status: 'error', message: err.message || 'Task update failed' });
	}
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
	try {
		const task = await taskRepo.findOne({
			where: { id: Number(req.params.id), user: { id: req.user.id } },
		});

		if (!task)
			return res
				.status(404)
				.json({ status: 'error', message: 'Task not found' });

		await taskRepo.remove(task);

		return res.json({ status: 'success', message: 'Task deleted', data: {} });
	} catch (err: any) {
		return res.status(500).json({
			status: 'error',
			message: err.message || 'Task deletion failed',
		});
	}
};
