import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Event } from "src/events/entity/events.entity";
import { Task } from "src/tasks/entiry/task.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100 })
  alias: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "date", nullable: true })
  start_date: Date;

  @Column({ type: "date", nullable: true, default: null })
  end_date: Date;

  @Column({ type: "boolean", default: false })
  is_published: boolean;

  @Column({ type: "int", default: 0 })
  total_hours: number;

  @OneToMany(() => Event, event => event.project, { onDelete: "CASCADE" })
  events: Event[];

  @OneToMany(() => Task, task => task.project, { onDelete: "CASCADE" })
  task: Task[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
