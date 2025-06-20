import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path/posix";
import { Response } from "express";
import { CookieAuthGuard } from "src/auth/token.guard";

@Controller("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post("create")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "profile_photo", maxCount: 1 }], {
      storage: diskStorage({
        destination: "./images",
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const originalName = file.originalname.split(ext)[0];
          cb(null, `${originalName}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (!allowedImageTypes.includes(file.mimetype)) {
          return cb(new BadRequestException("Only JPEG, JPG and PNG images are allowed"), false);
        }

        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  async register(
    @UploadedFiles()
    files: {
      profile_photo: Express.Multer.File[];
    },
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeeService.createEmployee(createEmployeeDto, files);
  }

  @Post("login")
  async login(@Body() loginEmployeeDto: { email: string; password: string }, @Res() res: Response) {
   try {
     const loggedinUser = await this.employeeService.loginEmployee(
       loginEmployeeDto.email,
       loginEmployeeDto.password,
     );
     res.cookie("access_token", loggedinUser.token.access_token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "strict",
       maxAge: 10 * 60 * 1000,
     });
     res.cookie("refresh_token", loggedinUser.token.refresh_token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "strict",
       maxAge: 3 * 24 * 60 * 60 * 1000,
     });
     return res.status(HttpStatus.OK).json({
       message: "Employee logged in successfully",
       data: loggedinUser.user,
     });
   } catch (error) {
     throw new BadRequestException({
       status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
       error: error?.response?.error ? error?.response?.error : error?.message,
     });
    
   }
  }

  @Get("refresh-auth")
  @UseGuards(CookieAuthGuard)
  async refreshAuth() {}
}
