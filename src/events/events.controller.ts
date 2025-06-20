import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto.";
import { CookieAuthGuard } from "src/auth/token.guard";
import { AuthGuard } from "src/auth/auth.guard";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Request, Response } from "express";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post("start")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async startEvent(
    @Body() startEvent: CreateEventDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const event = await this.eventsService.startEvent({
        ...startEvent,
        employee: { id: req["user"]["id"] },
      });
      return res.status(HttpStatus.CREATED).json({
        message: "Event started successfully",
        data: event,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put("stop")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async stopEvent(
    @Body() body: { id: string },
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const event = await this.eventsService.stopEvent(body.id, req["user"]["id"]);
      return res.status(HttpStatus.CREATED).json({
        message: "Event stopped successfully",
        data: event,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("working-event")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async getWorkingEvent(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const event = await this.eventsService.getWorkingEvent(req["user"]["id"]);
      if (event) {
        return res.status(HttpStatus.OK).json({
          message: "Working event",
          data: event,
        });
      }
      return res.status(HttpStatus.OK).json({
        message: "Not any working event",
        data: null,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("all-event-by-employee")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async getAllEventByEmployee(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const events = await this.eventsService.getAllEventByEmployee(req["user"]["id"]);
      return res.status(HttpStatus.OK).json({
        message: "All events",
        data: events,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put("update/:eventId")
  @UseGuards(CookieAuthGuard, AuthGuard)
  async updateEventById(
    @Param("eventId") id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedEvent = await this.eventsService.updateEventById(
        id,
        updateEventDto,
        req["user"]["id"],
      );

      return res.status(HttpStatus.OK).json({
        message: "Event updated successfully",
        data: updatedEvent,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error ? error?.response?.error : error?.message,
        },
        error.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
