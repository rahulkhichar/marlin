import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Payment, PaymentStatus } from '../entitys';
import { PaymentService } from '../services/payment.service';

@Processor('payment-queue')
export class PaymentProcessor {
  constructor(private readonly paymentService: PaymentService) {}
  @Process('process-payment')
  async handlePayment(job: Job<Partial<Payment>>) {
    console.log(job);

    const payment = job.data;

    if (Math.random() < 0.2) {
      await this.paymentService.updatePaymentStatus(
        payment.id,
        PaymentStatus.FAILED,
      );
      throw new Error('Payment gateway error');
    } else {
      await this.paymentService.updatePaymentStatus(
        payment.id,
        PaymentStatus.SUCCESS,
      );
    }

    console.log('Payment processed successfully!');
  }
}
