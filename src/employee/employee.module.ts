import { Module } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "./entity/employee.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("ACCESS_TOKEN_SECRET"),
        signOptions: { expiresIn: "10m" },
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("REFRESH_TOKEN_SECRET"),
        signOptions: { expiresIn: "3d" },
      }),
    }),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
