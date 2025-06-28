import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta } from '@todos/shared';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  /**
   * Creates a new Todo and associates it with an existing User.
   *
   * @param userID - The unique identifier of the User to whom the Todo will be assigned.
   * @param createTodoDto - DTO containing the properties of the Todo to create (e.g., title, description).
   * @returns The newly created Todo entity.
   * @throws NotFoundException if no User is found with the given ID.
   * @throws HttpException (500) if an error occurs while creating or saving the Todo.
   */
  async createTodoForUser(userID: string, createTodoDto: CreateTodoDto) {
    const user: User | null = await this.userRepository.findOneBy({
      id: userID,
    });
    if (!user) throw new NotFoundException(`User with ${userID} not found`);
    try {
      const task: Todo = this.todoRepository.create({ ...createTodoDto, user });
      await this.todoRepository.save(task);
      return task;
    } catch (e) {
      const originalError = e as Error;
      throw new HttpException(
        {
          message: originalError.message,
          success: false,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Retrieves all Todo tasks associated with a specific user.
   *
   * @param userID - The unique identifier of the user whose tasks are to be fetched.
   * @returns A promise that resolves to an array of Todo entities for the given user.
   *          If the user has no tasks, returns an empty array.
   * @throws NotFoundException if no user exists with the provided ID.
   */
  async findTaskRelatedToUser(userID: string): Promise<Todo[] | []> {
    const user: User | null = await this.userRepository.findOneBy({
      id: userID,
    });
    if (!user) throw new NotFoundException(`User with ${userID} not found`);
    return await this.todoRepository.find({ where: { user } });
  }

  /**
   * Retrieves a single Todo task by its unique identifier.
   *
   * @param id - The unique identifier of the task to retrieve.
   * @returns A promise that resolves to the Todo entity, including its associated User.
   * @throws NotFoundException if no task exists with the provided ID.
   */
  async findOneTask(id: string): Promise<Todo> {
    const task: Todo | null = await this.todoRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException(`Task with ${id} not found`);
    return task;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    if (!updateTodoDto.userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this task'
      );
    }
    const todo: Todo | undefined = await this.todoRepository.preload({
      id,
      ...updateTodoDto,
    });
    if (!todo) throw new NotFoundException(`Task with ${id} not found`);

    return await this.todoRepository.save(todo);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const taskExist = await this.todoRepository.count({ where: { id: id } });
    if (!taskExist) throw new NotFoundException(`Task with ${id} not found`);
    const result = await this.todoRepository.delete(id);
    if (!result.affected)
      throw new NotFoundException(`Task with ${id} not found`);
    return { success: true };
  }

  /**
   * 📖 Récupérer tous les todos (avec user), paginés.
   *
   * @param page  Numéro de page (1-indexed)
   * @param limit Nombre d’éléments par page
   */
  async findAllTaskForAllUsers(page = 1, limit = 10) {
    // 1️⃣ calculate offset
    const skip = (page - 1) * limit;

    // 2️⃣ find & count
    const [items, total] = await this.todoRepository.findAndCount({
      relations: ['user'],
      skip,
      take: limit,
    });

    // 3️⃣ calculate number of pages
    const totalPages = Math.ceil(total / limit);

    // 4️⃣ construct the Meta-pagination
    const pagination: IPaginationMeta = {
      page,
      limit,
      total,
      totalPages,
    };
    return {
      data: items,
      pagination,
    };
  }
}
