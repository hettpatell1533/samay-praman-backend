import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./entity/admin.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("ACCESS_TOKEN_SECRET"),
        signOptions: { expiresIn: "2m" },
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
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
