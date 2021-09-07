import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExchangeModule } from 'src/exchange/exchange.module';
import { ExchangeRepository } from 'src/exchange/exchange.repository';
import { ExchangeService } from 'src/exchange/exchange.service';
import { DepositsRepository } from './deposits.repository';
import { DepositsController } from './deposits.controller';
import { DepositsService } from './deposits.service';
import { DepositsShedulingService } from './deposits-sheduling.service';

@Module({
  imports: [ExchangeModule, HttpModule],
  controllers: [DepositsController],
  providers: [
    DepositsService,
    ExchangeService,
    ExchangeRepository,
    DepositsRepository,
    DepositsShedulingService,
  ],
})
export class DepositsModule {}
