import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class DepositsShedulingService implements OnApplicationShutdown {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  sheduleDeposits(callback?: (args?: unknown) => void) {
    callback();
    const job = new CronJob(process.env.DEPOSIT_SHEDULER_PATTERN, callback);
    this.schedulerRegistry.addCronJob(`${Date.now()}:deposits`, job);
    job.start();
  }

  cancelAllScheduledDeposits() {
    this.schedulerRegistry.getCronJobs().forEach((job) => job.stop());
  }
  onApplicationShutdown(signal: string) {
    if (signal === 'SIGINT' || signal === 'SIGENT') {
      this.cancelAllScheduledDeposits();
    }
  }
}
