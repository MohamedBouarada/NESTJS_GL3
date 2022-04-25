import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';

@Entity('cv')
export class Cv {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  firstname: string;

  @Column()
  @IsNotEmpty()
  job: string;

  @Column()
  @IsNotEmpty()
  path: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  cin: number;

  @ManyToOne(() => User, (e) => e.id, { eager: true })
  possessedBy: User;

  @ManyToMany(() => Skill, (e) => e.id)
  @JoinTable()
  skills: Skill[];
}
