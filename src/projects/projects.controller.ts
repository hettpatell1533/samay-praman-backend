import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Response } from "express";
import { CookieAuthGuard } from "src/auth/token.guard";
import { AuthGuard } from "src/auth/auth.guard";
import { AdminGuard } from "src/auth/admin.guard";
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post("create")
  @UseGuards(CookieAuthGuard, AuthGuard, AdminGuard)
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const project = await this.projectsService.createProject(createProjectDto);
      return res.status(HttpStatus.CREATED).json({
        message: "Project created successfully",
        data: project,
      });
    } catch (error) {
      return res.status(error.status).json(error.response.error);
    }
  }

  @Get("all")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async getAllProjects(@Res() res: Response): Promise<Response> {
    try {
      const projects = await this.projectsService.getAllProjects();
      return res.status(HttpStatus.OK).json({
        message: "All projects",
        data: projects,
      });
    } catch (error) {
      return res.status(error.status).json(error.response.error);
    }
  }

  @Get("published")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async getAllPublishedProjects(@Res() res: Response): Promise<Response> {
    try {
      const projects = await this.projectsService.getAllPlublishedProjects();
      return res.status(HttpStatus.OK).json({
        message: "All published projects",
        data: projects,
      });
    } catch (error) {
      return res.status(error.status).json(error.response.error);
    }
  }

  @Put("update/:id")
  @UseGuards(CookieAuthGuard, AuthGuard, AdminGuard)
  async updateProjectById(
    @Body() updateProjectDto: CreateProjectDto,
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const project = await this.projectsService.updateProjectById(id, updateProjectDto);
      return res.status(HttpStatus.OK).json({
        message: "Project updated successfully",
        data: project,
      });
    } catch (error) {
      return res.status(error.status).json(error.response ? error.response.error : error.message);
    }
  }
}
