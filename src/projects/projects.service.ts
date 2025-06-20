import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "./entity/projects.entity";
import { Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createProject(data: CreateProjectDto): Promise<Project> {
    try {
      const alreadyExistsProject = await this.projectRepository.findOne({
        where: { alias: data.alias },
      });
      if (alreadyExistsProject) {
        throw new HttpException("Project already exists", HttpStatus.CONFLICT);
      }
      const project = this.projectRepository.create(data);
      return await this.projectRepository.save(project);
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

  async getAllProjects(): Promise<Project[]> {
    try {
      return await this.projectRepository.find();
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

  async getAllPlublishedProjects(): Promise<Project[]> {
    try {
      return await this.projectRepository.find({ where: { is_published: true } });
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

  async updateProjectById(id: string, data: CreateProjectDto): Promise<Project> {
    try {
      const project = await this.projectRepository.findOne({ where: { id } });
      if (!project) {
        throw new HttpException("Project not found", HttpStatus.NOT_FOUND);
      }
      await this.projectRepository.merge(project, data);
      return await this.projectRepository.save(project);
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
