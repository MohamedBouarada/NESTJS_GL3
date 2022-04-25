import { IsEnum, IsOptional } from 'class-validator';
import { TodoStatusEnum } from '../enums/todo-status.enum';

export class GetTodoDto {
  @IsOptional()
  name: string;
  @IsOptional()
  description: string;
  @IsOptional()
  @IsEnum(TodoStatusEnum)
  status: TodoStatusEnum;
}
