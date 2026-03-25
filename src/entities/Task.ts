import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

export enum TaskStatus {
	PENDING = 'pending',
	IN_PROGRESS = 'in-progress',
	COMPLETED = 'completed',
}

@Entity()
export class Task {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ nullable: true })
	description: string;

	@Column({
		type: 'enum',
		enum: TaskStatus,
		default: TaskStatus.PENDING,
	})
	status: TaskStatus;

	@ManyToOne(() => User, (user) => user.tasks)
	user: User;
}
