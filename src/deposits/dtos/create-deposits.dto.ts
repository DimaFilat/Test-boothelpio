import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { IsFloat2Decimal } from 'src/validation/float-validation.decorator';

export class CreateDepositsDto {
  @ApiProperty({ description: 'ownername for deposit', required: true })
  @Type(() => String)
  @IsString()
  @MaxLength(32)
  @MinLength(3)
  public ownername: string;

  @ApiProperty({ description: 'price deposit in RUR', required: true })
  @Type(() => Number)
  @IsFloat2Decimal()
  public amountRUR: number;
}
