import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../models/TaskStatus.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.DONE,
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS
    ]
    
    transform(value: any) {
        console.log('value: ', value);
        value = value.toUpperCase();
        
        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is an invalid status.`);
        }

        return value;
    }

    private isStatusValid(status: any): boolean {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }

}