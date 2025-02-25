import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PaymentController } from './payment.controller';
import { PaymentProcessor } from './workers/payment.processor';
import { PaymentQueue } from './queue/payment.queue';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './repository/payment.repository';
import { LoggerService } from 'src/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entitys';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payment-queue',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentQueue,
    PaymentProcessor,
    PaymentService,
    PaymentRepository,
    LoggerService,
  ],
})
export class PatymentModule {}
