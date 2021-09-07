import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateExchangeUsdDto } from './dtos/create-exchange-usd.dto';

import { ExchangeRepository } from './exchange.repository';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly httpService: HttpService,
    private readonly exhangeRepository: ExchangeRepository,
  ) {
    this.fetchExchange(this.httpService);
  }
  async update() {
    await this.fetchExchange(this.httpService);
  }

  async find() {
    const exchangeUsd = await this.exhangeRepository.find('USD');
    return exchangeUsd;
  }

  private async save(exchange: CreateExchangeUsdDto) {
    this.exhangeRepository.save(exchange);
  }

  private async fetchExchange(http: HttpService) {
    http.get(process.env.EXCHANGE_API).subscribe(async (response) => {
      const result = response.data?.Valute?.USD;
      const exchangeUsd = {
        charcode: result.CharCode,
        name: result.Name,
        previous: this.toFloat2Decimal(result.Previous),
        value: this.toFloat2Decimal(result.Value),
      } as CreateExchangeUsdDto;

      await this.save(exchangeUsd);
    });
  }

  toFloat2Decimal(value: number) {
    return parseFloat(value.toFixed(2));
  }
}
// {"id":0,"ownerName":"Rosie Koss","amountRUR":"47342.00","amountUSD":"631.23"}
// {"id":1,"ownerName":"Haylie Shanahan","amountRUR":"643382.00","amountUSD":"8578.43"}
// {"id":2,"ownerName":"Gillian Collier","amountRUR":"714190.00","amountUSD":"9522.53"}
