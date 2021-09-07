import { Injectable, OnModuleInit } from '@nestjs/common';
import { once } from 'events';
import {
  appendFile,
  createReadStream,
  createWriteStream,
  existsSync,
  renameSync,
  unlink,
  promises,
} from 'fs';
import { createInterface, Interface } from 'readline';
import { Deposit } from './deposit.entity';

@Injectable()
export class DepositsRepository implements OnModuleInit {
  private path: string;
  private pathCopy: string;
  private idRegExp = /id":([0-9]+),/;
  private nl = '\n';
  private lastId = 0;
  numLines = 0;

  async onModuleInit() {
    try {
      const FILE_PATH = process.env.DEPOSIT_REPOSITORY_FILE_PATH;
      const reTxt = /.txt$/;
      const fileStat = await promises.stat(FILE_PATH);
      if (!fileStat) {
        throw new Error(`File path not found:(${FILE_PATH})`);
      }
      if (!reTxt.test(FILE_PATH)) {
        throw new Error('Not valid file format');
      }
      this.path = FILE_PATH;
      this.pathCopy = `${FILE_PATH.replace('.txt', '-copy')}.txt`;

      await this.readInitialDataFromFile();
    } catch (err) {
      throw new Error(`Failed initialize DepositFileWroker`);
    }
  }

  private createRLStream(): Interface {
    return createInterface({
      input: createReadStream(this.path),
      crlfDelay: Infinity,
    });
  }

  async findOne(id: number) {
    try {
      if (id > this.numLines) {
        throw new Error(`Not found`);
      }
      const pattern = this.generateSearchPatternById(id);
      const rl = this.createRLStream();
      for await (const line of rl) {
        if (pattern?.test(line)) {
          rl.close();
          return JSON.parse(line) as Deposit;
        }
      }
    } catch (err) {
      throw new Error(`Failed readLine: ${err}`);
    }
  }

  async find(start: number, end: number): Promise<Deposit[]> {
    let pivot = 0;
    const result: string[] = [];
    const rl = this.createRLStream();
    const startSlice = this.numLines - end;
    const endSlice = this.numLines - start;
    try {
      for await (const line of rl) {
        ++pivot;
        if (pivot > startSlice && pivot <= endSlice) {
          result.push(line);
        }
      }
    } catch (err) {
      throw new Error(`Failed read line from bottom: ${this.path}`);
    }
    if (!result.length) {
      return [];
    }
    const deposits = result.map((row) => JSON.parse(row)) as Deposit[];
    return deposits;
  }

  async save(deposit: Deposit) {
    const line = JSON.stringify(deposit);
    try {
      await appendFile(this.path, line + this.nl, (err) => {
        if (err) throw err;
      });
      this.numLines++;
    } catch (err) {
      throw new Error(`Failed writeLine ${err}`);
    }
  }

  async remove(id: number) {
    try {
      if (id > this.numLines) {
        throw new Error(`Not found`);
      }
      const pattern = this.generateSearchPatternById(id);
      const rl = this.createRLStream();
      let result: Deposit;
      const output = createWriteStream(this.pathCopy);
      for await (const line of rl) {
        if (pattern?.test(line)) {
          result = JSON.parse(line);
          continue;
        }
        const res = output.write(line + this.nl);
        if (!res) {
          await once(output, 'drain');
        }
      }
      this.numLines--;
      this.swapPaths();
      return result;
    } catch (err) {
      throw new Error(`Failed deleteLine: ${err}`);
    }
  }

  private parseDataIdFromLine(line: string) {
    let id: number;
    const rawId = line.match(this.idRegExp)?.[1];
    if (rawId) {
      id = Number(rawId);
      this.lastId = id;
      return id;
    }
    throw new Error(`Found deposit without id`);
  }

  private generateSearchPatternById(id: number) {
    return new RegExp(`id":${id},`, 'gm');
  }

  async readInitialDataFromFile() {
    const rl = this.createRLStream();
    try {
      for await (const line of rl) {
        ++this.numLines;
        this.parseDataIdFromLine(line);
      }
    } catch (err) {
      throw new Error('Failed get initial data from file');
    }
  }

  async updateAmountUsd(courseUSD: number) {
    const rl = this.createRLStream();
    const output = createWriteStream(this.pathCopy);
    try {
      for await (const line of rl) {
        const deposit = JSON.parse(line);
        deposit.amountUSD = this.calculateAmountUsd(
          deposit.amountRUR,
          courseUSD,
        );
        const depositRow = JSON.stringify(deposit);
        const res = output.write(depositRow + this.nl);
        if (!res) {
          await once(output, 'drain');
        }
      }
      this.swapPaths();
    } catch (err) {
      throw new Error('Failed get initial data from file');
    }
  }

  create({
    ownername,
    amountRUR,
    courseUSD,
  }: {
    ownername: string;
    amountRUR: number;
    courseUSD: number;
  }) {
    const id = ++this.lastId;
    const deposit = {
      id,
      ownername,
      amountRUR,
      amountUSD: this.calculateAmountUsd(amountRUR, courseUSD),
    } as Deposit;
    return deposit;
  }

  calculateAmountUsd(amountRUR: number, courseUSD: number) {
    return parseFloat((amountRUR / courseUSD).toFixed(2));
  }

  swapPaths() {
    const p = 'buffer.txt';
    try {
      renameSync(this.path, p);
      renameSync(this.pathCopy, this.path);
      renameSync(p, this.pathCopy);
    } catch (err) {
      throw new Error(`Failed swapPaths: ${err}`);
    }
  }

  deleteCopyFile() {
    return new Promise<void>((resolve, reject) => {
      if (existsSync(this.pathCopy)) {
        unlink(this.pathCopy, (err) => {
          if (err) reject(err);
          resolve();
        });
      }
      resolve();
    });
  }
}
