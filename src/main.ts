import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
