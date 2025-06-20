import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  phone: string;

  @IsEnum(["male", "female"])
  gender: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date_of_birth: Date;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  profile_photo: string;

  @IsString()
  position: string;

  @IsString()
  salary: number;
}
