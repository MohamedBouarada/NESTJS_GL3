import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";


@Entity("skill")
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  @IsNotEmpty()
  designation:string;


}
