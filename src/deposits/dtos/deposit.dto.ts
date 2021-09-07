import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

import { IsFloat2Decimal } from 'src/validation/float-validation.decorator';

export class DepositDto {
  @IsNumber()
  id: number;

  @IsString()
  @MaxLength(32)
  @MinLength(3)
  public ownername: string;

  @IsNumber()
  @IsFloat2Decimal({})
  public amountRUR: number;

  @IsNumber()
  @IsFloat2Decimal()
  public amountUSD: number;
}
