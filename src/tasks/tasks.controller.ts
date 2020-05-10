import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './models/TaskStatus.enum';
import { CreateTaskDTO } from './data/CreateTaskDTO';
import { GetTasksFilterDTO } from './data/GetTasksFilterDTO';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './models/Task.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/models/User.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TaskController')

    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDTO,
        @GetUser() user: User
        ) {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id: string,
        @GetUser() user: User
        ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: User
        ): Promise<Task> {
        return this.tasksService.createTask(createTaskDTO, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id: string,
        @GetUser() user: User
        ): Promise<DeleteResult> {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTaskById(
        @Param('id') id: string, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
        ): Promise<Task> {
        return this.tasksService.updateTaskById(id, status, user);
    }
}
