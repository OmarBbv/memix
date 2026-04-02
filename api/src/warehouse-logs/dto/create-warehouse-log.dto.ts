import { IsInt, IsNumber, IsDateString, Min, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseLogDto {
  @ApiProperty({ description: 'The date of the record', example: '2026-04-01' })
  @IsDateString()
  recordDate: Date;

  @ApiProperty({ description: 'Total product count', example: 1000 })
  @IsInt()
  @Min(0)
  productCount: number;

  @ApiProperty({ description: 'Total value amount', example: 1000.0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ description: 'Optional notes/information', example: 'Monthly report' })
  @IsString()
  @IsOptional()
  note?: string;
}
