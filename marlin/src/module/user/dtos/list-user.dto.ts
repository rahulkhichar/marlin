import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsISO8601 } from 'class-validator';
export class ListUserDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsISO8601()
  snapshotTimestamp?: string;
}
