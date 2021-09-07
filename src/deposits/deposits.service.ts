import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';

import { FindDepositDto } from './dtos/find-deposits.dto';
import { DepositsRepository } from './deposits.repository';
import { ExchangeService } from 'src/exchange/exchange.service';
import { DepositsShedulingService } from './deposits-sheduling.service';

@Injectable()
export class DepositsService implements BeforeApplicationShutdown {
  constructor(
    private readonly depositsRepository: DepositsRepository,
    private readonly exchangeService: ExchangeService,
    private readonly depositsShedulingService: DepositsShedulingService,
  ) {
    this.depositsShedulingService.sheduleDeposits(() =>
      this.updateAmountUsd(this.exchangeService),
    );
  }

  async beforeApplicationShutdown(signal: string) {
    if (signal === 'SIGINT' || signal === 'SIGTERM') {
      await this.depositsRepository.deleteCopyFile();
    }
  }

  async find(params: FindDepositDto) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 15;

    const start = (page - 1) * limit;
    const end = start + limit;
    const deposits = await this.depositsRepository.find(start, end);
    return deposits;
  }

  async create(ownername: string, amountRUR: number) {
    const exchange = await this.exchangeService.find();
    const deposit = this.depositsRepository.create({
      ownername,
      amountRUR,
      courseUSD: exchange.value,
    });
    await this.depositsRepository.save(deposit);
    return deposit;
  }

  async findOne(id: number) {
    const deposit = await this.depositsRepository.findOne(id);
    return deposit;
  }

  async remove(id: number) {
    const deposit = await this.depositsRepository.remove(id);
    if (!deposit) {
      throw new Error(`Deposit not found`);
    }
    return deposit;
  }

  async updateAmountUsd(exchangeService: ExchangeService) {
    await exchangeService.update();
    const exchange = await exchangeService.find();
    await this.depositsRepository.updateAmountUsd(exchange.value);
  }
}
