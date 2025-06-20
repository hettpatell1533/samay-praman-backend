import { IsBoolean, IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  project: { id: string };

  @IsOptional()
  @IsObject()
  employee: { id: string };

  @IsBoolean()
  @IsOptional()
  is_published: boolean;

  @IsOptional()
  @IsInt()
  total_hours: number;
}
