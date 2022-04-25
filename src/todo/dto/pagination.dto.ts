import {
  IsEAN,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  order: string;

  @IsOptional()
 @IsIn(["ASC" ,"DESC"])
  sort: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  perPage: number;
}
