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
export class Admin {
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
