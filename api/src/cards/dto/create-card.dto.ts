import {
  IsString,
  IsNumber,
  Min,
  Max,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  holderName: string;

  @IsString()
  @Length(16, 16)
  cardNumber: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  expMonth: number;

  @IsNumber()
  @Min(2024)
  expYear: number;

  @IsString()
  cvv: string; // Not stored!

  @IsString()
  @IsOptional()
  color?: string;
}
