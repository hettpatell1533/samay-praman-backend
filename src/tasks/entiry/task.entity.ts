import { Employee } from "src/employee/entity/employee.entity";
import { Event } from "src/events/entity/events.entity";
import { Project } from "src/projects/entity/projects.entity";
import { TASK_STATUS } from "src/shared/lib/status.type";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  estimated_time: string;

  @ManyToOne(() => Project, project => project.task, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project: Project;

  @ManyToOne(() => Employee, employee => employee.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employee_id" })
  employee: Employee;

  @ManyToOne(() => Event, event => event.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event: Event;

  @Column({ type: "enum", enum: TASK_STATUS, default: TASK_STATUS.PENDING })
  status: TASK_STATUS;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
