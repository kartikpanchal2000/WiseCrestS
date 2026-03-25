import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const userRepo = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ status: 'error', message: 'All fields required' });
		}

		const existing = await userRepo.findOneBy({ email });
		if (existing) {
			return res
				.status(400)
				.json({ status: 'error', message: 'Email already exists' });
		}

		const hashed = await bcrypt.hash(password, 10);
		const user = userRepo.create({ name, email, password: hashed });
		await userRepo.save(user);

		return res
			.status(201)
			.json({ status: 'success', message: 'User registered', data: user });
	} catch (err: any) {
		return res
			.status(500)
			.json({ status: 'error', message: err.message || 'Registration failed' });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await userRepo.findOneBy({ email });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res
				.status(400)
				.json({ status: 'error', message: 'Invalid credentials' });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
			expiresIn: '1d',
		});

		return res.json({
			status: 'success',
			message: 'Login successful',
			data: { token },
		});
	} catch (err: any) {
		return res
			.status(500)
			.json({ status: 'error', message: err.message || 'Login failed' });
	}
};
