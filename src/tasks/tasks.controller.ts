import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CookieAuthGuard } from "src/auth/token.guard";
import { AuthGuard } from "src/auth/auth.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Request, Response } from "express";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post("create")
  @UseGuards(CookieAuthGuard, AuthGuard, AdminGuard)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const task = await this.tasksService.createTask(createTaskDto);

      return res.status(HttpStatus.CREATED).json({
        message: "Task is created and assigned Successfully",
        data: task,
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

  @Get("")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async getAllTasks(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const tasks = await this.tasksService.getAllTasks(req["user"]["id"]);
      return res.status(HttpStatus.OK).json({
        message: "All tasks",
        data: tasks,
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

  @Get("completed")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async getAllCompletedTasks(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const tasks = await this.tasksService.getAllCompletedTasks();
      return res.status(HttpStatus.OK).json({
        message: "All completed tasks",
        data: tasks,
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

  @Get("pending")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async getAllPendingTasks(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const tasks = await this.tasksService.getAllPendingTasks();
      return res.status(HttpStatus.OK).json({
        message: "All pending tasks",
        data: tasks,
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

  @Put(":id")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async updateTaskById(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedTask = await this.tasksService.updateTaskById(
        id,
        updateTaskDto,
        req["user"]["id"],
      );

      return res.status(HttpStatus.OK).json({
        message: "Task updated successfully",
        data: updatedTask,
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

  @Delete(":id")
  @UseGuards(CookieAuthGuard, AuthGuard, AdminGuard)
  async deleteTaskById(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const deletedTask = await this.tasksService.deleteTaskById(id);

      return res.status(HttpStatus.OK).json({
        message: "Task deleted successfully",
        data: deletedTask,
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
}
