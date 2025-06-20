import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "../employee/entity/employee.entity";
import { Admin } from "../admin/entity/admin.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Employee) private emloyeeRepository: Repository<Employee>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: req => {
        if (!req.headers.authorization) {
          return null;
        }
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: true,
      secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: any) {
    const { sub, email, role } = payload;

    if (!sub || !email) {
      throw new UnauthorizedException("Invalid token payload");
    }

    let user;

    if (role === "admin") {
      const admin = await this.adminRepository.findOne({ where: { id: sub } });
      if (!admin) {
        throw new UnauthorizedException("Admin not found");
      }

      user = admin;
    } else {
      const employee = await this.emloyeeRepository.findOne({ where: { id: sub } });
      if (!employee) {
        throw new UnauthorizedException("Employee not found");
      }

      user = employee;
    }

    user.role = role;

    return user;
  }
}
