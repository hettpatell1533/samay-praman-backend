import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { TASK_STATUS } from "src/shared/lib/status.type";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  estimated_time: string;

  @IsOptional()
  @IsEnum(TASK_STATUS)
  status: TASK_STATUS;

  @IsNotEmpty()
  @IsObject()
  project: { id: string };

  @IsOptional()
  @IsObject()
  event: { id: string };

  @IsNotEmpty()
  @IsObject()
  employee: { id: string };
}
