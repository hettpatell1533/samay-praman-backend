import { CryptoService } from "src/shared/lib/utility";
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
} from "typeorm";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100 })
  @Index({ unique: true })
  email: string;

  @Column({ type: "varchar", length: 100, default: null })
  @Index({ unique: true })
  phone: string;

  @Column({
    type: "varchar",
    length: 255,
    transformer: {
      to: (value: string) => CryptoService.hashPassword(value),
      from: (value: string) => value,
    },
  })
  password: string;

  @Column({ type: "enum", enum: ["male", "female"], enumName: "gender" })
  gender: string;

  @Column({ type: "date", default: null })
  date_of_birth: Date;

  @Column({ type: "varchar", length: 255, default: null })
  profile_photo: string;

  @Column({ type: "varchar", length: 255, default: null })
  address: string;

  @Column({ type: "varchar", length: 255, default: null })
  position: string;

  @Column({ type: "int" })
  salary: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
