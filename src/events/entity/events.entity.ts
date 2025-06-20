import { Employee } from "src/employee/entity/employee.entity";
import { Project } from "src/projects/entity/projects.entity";
import { Task } from "src/tasks/entiry/task.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: null })
  description: string;

  @ManyToOne(() => Project, project => project.events, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project: Project;

  @ManyToOne(() => Employee, employee => employee.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employee_id" })
  employee: Employee;

  @OneToMany(() => Task, task => task.id, { onDelete: "CASCADE" })
  task: Task[];

  @Column({ type: "boolean", default: false })
  is_published: boolean;

  @Column({ type: "datetime" })
  start_date: Date;

  @Column({ type: "datetime", nullable: true })
  end_date: Date;

  @Column({ type: "int", default: 0 })
  total_hours: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
