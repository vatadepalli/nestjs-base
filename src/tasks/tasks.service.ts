import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './models/TaskStatus.enum';
import { CreateTaskDTO } from './data/CreateTaskDTO';
import { GetTasksFilterDTO } from './data/GetTasksFilterDTO';
import { TaskRepository, Task } from './models/Task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { User } from 'src/auth/models/User.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
        ) {}


    async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({
            where: {
                id,
                userId: user.id
            }
        });

        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not found.`);
        }

        return found;
    }

    async deleteTaskById(id: string, user: User): Promise<DeleteResult> {
        // return this.getTaskById(id).then((foundTask) => {
        //     return Task.remove(foundTask);
        // })

        const result = await this.taskRepository.delete({ id, userId: user.id });

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID: ${id} not found.`);
        }
        
        console.log(result);
        return result;
    }

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, user);
    }

    async updateTaskById(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        return await task.save();
    }
}
