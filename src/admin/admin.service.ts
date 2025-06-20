import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "./entity/admin.entity";
import { CreateAdmineDto } from "./dto/create-admin.dto";
import { CryptoService } from "src/shared/lib/utility";

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}

  async registerAdmin(data: CreateAdmineDto): Promise<Admin> {
    try {
      const userExists = await this.adminRepository.findOne({
        where: { email: data.email },
      });
      if (userExists) {
        throw new HttpException("Admin already exists", HttpStatus.CONFLICT);
      }
      const newAdmin = this.adminRepository.create(data);
      return await this.adminRepository.save(newAdmin);
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

  async loginAdmin(
    email: string,
    password: string,
  ): Promise<{ admin: Admin; token: { access_token: string; refresh_token: string } }> {
    try {
      const admin = await this.adminRepository.findOne({ where: { email } });
      if (!admin) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      if (!CryptoService.comparePassword(password, admin.password)) {
        throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
      }
      const payload = { email: admin.email, sub: admin.id, role: "admin" };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: "10m",
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: "3d",
      });
      return {
        admin,
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
