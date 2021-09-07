import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepositsModule } from './deposits/deposits.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot(), DepositsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
