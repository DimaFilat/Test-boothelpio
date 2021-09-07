import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { CreateExchangeUsdDto } from './dtos/create-exchange-usd.dto';

@Injectable()
export class ExchangeRepository {
  private readonly filePath = process.env.EXHANGE_REPOSITORY_FILE_PATH;
  async find(charcode: string) {
    const exchanges = await readFile(this.filePath, 'utf-8');
    const exchangeUsd = JSON.parse(exchanges)[charcode];
    return exchangeUsd;
  }

  async save(exchangeUsd: CreateExchangeUsdDto) {
    try {
      const contents = await readFile(this.filePath, 'utf-8');
      const exchanges = JSON.parse(contents);

      exchanges[exchangeUsd.charcode] = exchangeUsd;

      const serializedExchange = JSON.stringify(exchanges, null, 2);
      await writeFile(this.filePath, serializedExchange + '\n');
    } catch (error) {
      console.error(error);
    }
  }
}
