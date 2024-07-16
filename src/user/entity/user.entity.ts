import { Role } from '../../enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id?: number;

  @Column({
    length: 127,
    unique: true,
  })
  email: string;

  @Column({
    length: 63,
  })
  name: string;

  @Column({
    length: 127,
  })
  password: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthAt?: Date;

  @Column({
    enum: [1, 2],
    default: Role.User,
  })
  role: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
