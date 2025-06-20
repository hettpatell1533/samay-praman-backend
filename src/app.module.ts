import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmployeeModule } from "./employee/employee.module";
import { AdminModule } from "./admin/admin.module";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import config from "./shared/config/db.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ProjectsModule } from "./projects/projects.module";
import { EventsModule } from "./events/events.module";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from './tasks/tasks.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(config as TypeOrmModuleOptions),
    EmployeeModule,
    AdminModule,
    ProjectsModule,
    EventsModule,
    TasksModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            ignore: 'req,res',
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
