import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, EntityRepository, Repository, ManyToOne } from "typeorm";
import { TaskStatus } from "./TaskStatus.enum";
import { CreateTaskDTO } from "../data/CreateTaskDTO";
import { GetTasksFilterDTO } from "../data/GetTasksFilterDTO";
import { User } from "src/auth/models/User.entity";

@Entity()
export class Task extends BaseEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(type => User, user => user.tasks, {
        eager: false
    })
    user: User;
    @Column()
    userId: string;
}


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.andWhere('task.userId = :id', { id: user.id })

        if (status) {
            query.andWhere('task.status = :status', { status: status });
        }

        if (search) {
            query.andWhere("(task.title LIKE :search OR task.description LIKE :search)", { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        const { title, description } = createTaskDTO;
        
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        delete task.user;
        return task;
    }

}