import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateDepositsDto } from './dtos/create-deposits.dto';
import { FindDepositDto } from './dtos/find-deposits.dto';
import { DepositsService } from './deposits.service';
import { ExchangeService } from 'src/exchange/exchange.service';

@Controller('deposits')
export class DepositsController {
  constructor(
    private depositsService: DepositsService,
    private exchageService: ExchangeService,
  ) {}

  @Get()
  @UsePipes(ValidationPipe)
  async listDeposits(@Query() params: FindDepositDto) {
    return this.depositsService.find(params);
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  async findDeposit(@Param('id') id: string) {
    const deposit = await this.depositsService.findOne(parseInt(id));
    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }
    return deposit;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async createDeposits(@Body() body: CreateDepositsDto) {
    const { ownername, amountRUR } = body;
    return this.depositsService.create(ownername, amountRUR);
  }

  @Delete('/:id')
  async removeDeposit(@Param('id') id: string) {
    return this.depositsService.remove(parseInt(id));
  }
}
