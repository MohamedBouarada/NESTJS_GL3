import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Todo } from './Model/todo.model';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TodoService } from './todo.service';
import { TodoEntity } from './Entity/todo.entity';
import { UpdateTodoDto } from './update-todo.dto';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { SearchTodoDto } from './dto/search-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';
import { PaginationDto } from './dto/pagination.dto';
import { TodoStatusEnum } from './enums/todo-status.enum';
import { DateIntervalDto } from './dto/date-interval.dto';
@Controller({
  path: 'todo',
  version: '2',
})
export class TodoDBController {
  constructor(private todoService: TodoService) {}
  @Get()
  getTodos(@Query() searchTodoDto: SearchTodoDto): Promise<TodoEntity[]> {
    return this.todoService.findAll(searchTodoDto);
  }

  @Post()
  addTodo(@Body() newTodoData: Partial<TodoEntity>): Promise<TodoEntity> {
    return this.todoService.addTodo(newTodoData);
  }
  @Patch(':id')
  updateTodo(
    @Body() updateTodoDto: UpdateTodoDto,
    @Param('id') id: string,
  ): Promise<TodoEntity> {
    return this.todoService.updateTodo(updateTodoDto, id);
  }
  @Delete(':id')
  deleteTodo(@Param('id') id: string): Promise<DeleteResult> {
    return this.todoService.deleteTodo(id);
  }
  @Delete('/soft/:id')
  softDeleteTodo(@Param('id') id: string): Promise<UpdateResult> {
    return this.todoService.softDeleteTodo(id);
  }
  @Patch('/soft/:id')
  softRestoreTodo(@Param('id') id: string): Promise<UpdateResult> {
    return this.todoService.softRestoreTodo(id);
  }
  @Get('version')
  version() {
    return '2';
  }
  @Get('exercice229')
  getAllWithQuery(@Query() getTodoDTO: GetTodoDto): Promise<TodoEntity[]> {
    return this.todoService.findAllWithQueryBuilder(getTodoDTO);
  }
  @Get('exercice233')
  getAllWithPagination(
    @Query() paginationDto: PaginationDto,
  ): Promise<TodoEntity[]> {
    return this.todoService.findAllWithPagination(paginationDto);
  }
  @Get('exercice236/:status')
  getStatusStats(
    @Param('status') status: TodoStatusEnum,
    @Body() dateInterval: DateIntervalDto,
  ) {
    return this.todoService.numberTodosForStatus(status, dateInterval);
  }
}
