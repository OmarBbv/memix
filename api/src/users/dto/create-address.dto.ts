import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  title: string;

  @IsString()
  phone: string;

  @IsString()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
