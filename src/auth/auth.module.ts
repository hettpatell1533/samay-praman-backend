import { Global, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "src/employee/entity/employee.entity";
import { Admin } from "src/admin/entity/admin.entity";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthGuard } from "./auth.guard";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Admin]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("ACCESS_TOKEN_SECRET"),
        signOptions: { expiresIn: "2m" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthGuard],
  exports: [JwtModule, AuthGuard, JwtStrategy],
})
export class AuthModule {}
