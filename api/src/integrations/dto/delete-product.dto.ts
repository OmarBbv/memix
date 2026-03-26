import { IsString, IsOptional } from 'class-validator';

export class DeleteProductDto {
  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  guid1c?: string;
}
