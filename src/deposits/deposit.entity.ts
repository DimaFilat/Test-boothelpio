import { IsInt, IsString } from 'class-validator';
import { IsFloat2Decimal } from 'src/validation/float-validation.decorator';

export class Deposit {
  @IsInt()
  id: number;

  @IsString()
  ownername: string;

  @IsFloat2Decimal()
  amountRUR: number;

  @IsFloat2Decimal()
  amountUSD: number;
}
