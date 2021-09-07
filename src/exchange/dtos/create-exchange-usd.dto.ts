import { IsNumber, IsString } from 'class-validator';

export class CreateExchangeUsdDto {
  @IsString()
  charcode: string;

  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsNumber()
  previous: number;
}
