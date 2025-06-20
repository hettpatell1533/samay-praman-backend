import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "./entity/employee.entity";
import { Repository } from "typeorm";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { CryptoService } from "src/shared/lib/utility";

@Injectable()
export class EmployeeService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
  ) {}

  async createEmployee(
    employee: CreateEmployeeDto,
    files: { profile_photo: Express.Multer.File[] },
  ): Promise<Employee> {
    try {
      const userExists = await this.employeeRepository.findOne({
        where: { email: employee.email },
      });
      if (userExists) {
        throw new HttpException("Employee already exists", HttpStatus.CONFLICT);
      }
      const { profile_photo } = files;
      employee.profile_photo = profile_photo[0].path;
      const newEmployee = this.employeeRepository.create(employee);
      return this.employeeRepository.save(newEmployee);
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

  async loginEmployee(email: string, password: string): Promise<any> {
    try {
      const employee = await this.employeeRepository.findOne({ where: { email } });
      if (!employee) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      if (!CryptoService.comparePassword(password, employee.password)) {
        throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
      }
      const payload = { email: employee.email, sub: employee.id };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: "10m",
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: "3d",
      });
      return {
        employee,
        token: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      };
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
