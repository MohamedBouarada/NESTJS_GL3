import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Like, Repository } from 'typeorm';
import { TodoEntity } from './Entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTodoDto } from './update-todo.dto';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { SearchTodoDto } from './dto/search-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';
import { PremierModule } from '../premier/premier.module';
import { PaginationDto } from './dto/pagination.dto';
import { TodoStatusEnum } from './enums/todo-status.enum';
import { DateIntervalDto } from './dto/date-interval.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}
  addTodo(todo: Partial<TodoEntity>): Promise<TodoEntity> {
    return this.todoRepository.save(todo);
  }

  async updateTodo(
    updateTodoDto: UpdateTodoDto,
    id: string,
  ): Promise<TodoEntity> {
    const newTodo = await this.todoRepository.preload({ id, ...updateTodoDto });
    if (newTodo) {
      return this.todoRepository.save(newTodo);
    } else {
      throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
    }
  }

  async deleteTodo(id: string): Promise<DeleteResult> {
    const result = await this.todoRepository.delete(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }
  async softDeleteTodo(id: string): Promise<UpdateResult> {
    const result = await this.todoRepository.softDelete(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }

  async softRestoreTodo(id: string) {
    const result = await this.todoRepository.restore(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }

  findAll(searchTodoDto: SearchTodoDto): Promise<TodoEntity[]> {
    const criterias = [];
    if (searchTodoDto.status) {
      criterias.push({ status: searchTodoDto.status });
    }
    if (searchTodoDto.criteria) {
      criterias.push({ name: Like(`%${searchTodoDto.criteria}%`) });
      criterias.push({ description: Like(`%${searchTodoDto.criteria}%`) });
    }
    if (criterias.length) {
      return this.todoRepository.find({ withDeleted: true, where: criterias });
    }
    return this.todoRepository.find({ withDeleted: true });
  }
  findAllWithQueryBuilder(getTodoDto: GetTodoDto): Promise<TodoEntity[]> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');

    if (getTodoDto.name && getTodoDto.description) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('todo.name like :name', {
            name: `%${getTodoDto.name}%`,
          }).orWhere('todo.description like :description', {
            description: `%${getTodoDto.description}%`,
          });
        }),
      );
    } else if (getTodoDto.name) {
      queryBuilder.where('todo.name like :name', {
        name: `%${getTodoDto.name}%`,
      });
    } else if (getTodoDto.description) {
      queryBuilder.where('todo.description like :description', {
        description: `%${getTodoDto.description}%`,
      });
    }
    if (getTodoDto.status) {
      queryBuilder.andWhere('todo.status = :status', {
        status: `%${getTodoDto.status}%`,
      });
    }

    return queryBuilder.execute();
  }
  async findAllWithPagination(
    paginationOptions: PaginationDto,
  ): Promise<TodoEntity[]> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');
    const order = paginationOptions.order ? paginationOptions.order : 'name';
    const sort = paginationOptions.sort
      ? paginationOptions.sort === 'ASC'
        ? 'ASC'
        : 'DESC'
      : 'ASC';
    const page = paginationOptions.page ? paginationOptions.page : 1;
    const perPage = paginationOptions.perPage ? paginationOptions.perPage : 10;
    const total = await queryBuilder.getCount();

    queryBuilder.orderBy(`todo.${order}`, sort);
    queryBuilder.offset((page - 1) * perPage).limit(perPage);

    return queryBuilder.getMany();
  }

  numberTodosForStatus(
    status: TodoStatusEnum,
    dateInterval: DateIntervalDto,
  ): Promise<TodoEntity[]> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');
    if (dateInterval.dateDebut && dateInterval.dateFin) {
      queryBuilder
        .select('todo.status')
        .distinct(true)
        .where('todo.createdAt > :dateDebut', {
          dateDebut: dateInterval.dateDebut,
        })
        .andWhere('todo.createdAt < :dateFin', {
          dateFin: dateInterval.dateFin,
        });
      return queryBuilder.getRawMany();
    }
    queryBuilder
      .select('count(todo.status) , todo.status' )
      .groupBy('todo.status');

    return queryBuilder.getRawMany();
  }
}
