import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdmineDto } from "./dto/create-admin.dto";
import { Response } from "express";
import { Admin } from "./entity/admin.entity";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("create")
  async registerAdmin(
    @Body() createAdminDto: CreateAdmineDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const admin = await this.adminService.registerAdmin(createAdminDto);

      return res.status(201).json({
        message: "Admin registered successfully",
        data: admin,
      });
    } catch (error) {
      return res.status(error.status).json(error.response.error);
    }
  }

  @Post("login")
  async loginAdmin(
    @Body() loginAdminDto: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const loggedinAdmin = await this.adminService.loginAdmin(
        loginAdminDto.email,
        loginAdminDto.password,
      );
      res.cookie("access_token", loggedinAdmin.token.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 1000,
      });
      res.cookie("refresh_token", loggedinAdmin.token.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      return res.status(HttpStatus.OK).json({
        message: "Admin logged in successfully",
        data: loggedinAdmin.admin,
      });
    } catch (error) {
      return res.status(error.status).json(error.response.error);
    }
  }
}
