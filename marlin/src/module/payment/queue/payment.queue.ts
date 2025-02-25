import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Payment } from '../entitys';

@Injectable()
export class PaymentQueue {
  constructor(@InjectQueue('payment-queue') private queue: Queue) {}

  async addPaymentTask(payment: Partial<Payment>) {
    await this.queue.add('process-payment', payment, {
      attempts: 5, // Retry up to 5 times
      backoff: { type: 'exponential', delay: 1000 }, // 1s, 2s, 4s, 8s...
    });
  }
}
