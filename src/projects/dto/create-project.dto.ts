import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  start_date: string;

  @IsOptional()
  @IsString()
  end_date: string;

  @IsBoolean()
  @IsNotEmpty()
  is_published: boolean;

  @IsOptional()
  @IsInt()
  total_hours: number;
}
