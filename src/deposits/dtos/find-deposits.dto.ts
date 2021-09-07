import { ApiProperty } from '@nestjs/swagger';
import { Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindDepositDto {
  @ApiProperty({ description: 'page number for request', required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page?: number;

  @ApiProperty({ description: 'limit number for request', required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public limit?: number;
}
