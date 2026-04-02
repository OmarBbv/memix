import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSizeTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
