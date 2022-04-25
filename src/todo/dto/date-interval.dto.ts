import { IsDate, IsDateString, IsOptional } from "class-validator";

export class DateIntervalDto {
  @IsOptional()
  @IsDateString()
  dateDebut: Date;
  @IsOptional()
  @IsDateString()
  dateFin: Date;
}
