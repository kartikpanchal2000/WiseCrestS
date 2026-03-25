import { AppDataSource } from './config/data-source';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

AppDataSource.initialize().then(() => {
	app.listen(process.env.PORT, () => {
		console.log(`Server running on port ${process.env.PORT}`);
	});
});
