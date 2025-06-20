import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { CreateEventDto } from "./dto/create-event.dto.";
import { Event } from "./entity/events.entity";
import { UpdateEventDto } from "./dto/update-event.dto";
import * as moment from "moment";

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}

  async startEvent(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const isAnyEventStart = await this.eventRepository.findOne({
        where: { employee: { id: createEventDto.employee.id }, end_date: IsNull() },
      });

      if (isAnyEventStart) {
        throw new HttpException("Employee already has a working event", HttpStatus.CONFLICT);
      }
      const event = this.eventRepository.create({
        description: createEventDto.description,
        start_date: moment().toDate(),
        project: createEventDto.project,
        employee: createEventDto.employee,
        is_published: createEventDto.is_published,
        total_hours: createEventDto.total_hours,
      });
      return await this.eventRepository.save(event);
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

  async stopEvent(id: string, employeeId: string): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({
        where: { project: { id }, employee: { id: employeeId }, end_date: IsNull() },
        relations: ["employee", "project"],
      });
      if (!event) {
        throw new HttpException("Event not found", HttpStatus.NOT_FOUND);
      }

      event.end_date = moment().toDate();
      event.is_published = true;
      return await this.eventRepository.save(event);
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

  async getWorkingEvent(employeeId: string): Promise<Event | null> {
    try {
      const event = await this.eventRepository.findOne({
        where: { end_date: IsNull(), employee: { id: employeeId }, is_published: false },
        relations: ["employee", "project"],
      });
      if (!event) {
        return null;
      }
      return event;
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

  async getAllEventByEmployee(employeeId: string): Promise<Event[]> {
    try {
      return await this.eventRepository.find({
        where: { employee: { id: employeeId }, end_date: Not(IsNull()) },
        relations: ["employee", "project"],
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

  async updateEventById(
    id: string,
    updateEventDto: UpdateEventDto,
    employeeId: string,
  ): Promise<Event> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id, employee: { id: employeeId } },
      });

      if (!event) {
        throw new HttpException("No event found", HttpStatus.NOT_FOUND);
      }

      await this.eventRepository.merge(event, updateEventDto);
      return await this.eventRepository.save(event);
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
