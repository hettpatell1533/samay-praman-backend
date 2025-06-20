import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entiry/task.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TASK_STATUS } from "src/shared/lib/status.type";

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>) {}
  async createTask(createTask: CreateTaskDto): Promise<Task> {
    try {
      const task = await this.taskRepository.create(createTask);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllTasks(id: string): Promise<Task[]> {
    try {
      return await this.taskRepository.find({
        where: { employee: { id } },
        relations: ["project", "event"],
      });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCompletedTasks(): Promise<Task[]> {
    try {
      return await this.taskRepository.find({ where: { status: TASK_STATUS.COMPLETED } });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPendingTasks(): Promise<Task[]> {
    try {
      return await this.taskRepository.find({ where: { status: TASK_STATUS.PENDING } });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ["project", "event"],
      });
      if (!task) {
        throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
      }
      return task;
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTaskById(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id, employee: { id: userId } } });
      if (!task) {
        throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
      }
      await this.taskRepository.merge(task, updateTaskDto);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
      }
      return await this.taskRepository.remove(task);
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async completedTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
      }
      task.status = TASK_STATUS.COMPLETED;
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
