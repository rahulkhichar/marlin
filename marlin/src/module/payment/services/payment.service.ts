import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { LoggerService } from 'src/utils';
import { PaymentRepository } from '../repository/payment.repository';
import { CreatePaymentDto } from '../dtos';
import { PaymentStatus } from '../entitys';
import { PaymentQueue } from '../queue/payment.queue';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentQueue: PaymentQueue,
    private readonly logger: LoggerService,
  ) {}

  async findAll() {
    return this.paymentRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.paymentRepository.findById(id);
    if (!user) {
      this.logger.warn(`User not found: ${id}`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const existingPayment = await this.paymentRepository.find({
      where: { transactionId: createPaymentDto.transactionId },
    });

    if (existingPayment) {
      switch (existingPayment.status) {
        case PaymentStatus.SUCCESS:
          return {
            message: 'Payment already completed',
            id: existingPayment.id,
            transactionId: existingPayment.transactionId,
          };

        case PaymentStatus.PROCESSING:
          return {
            message: 'Payment is still being processed',
            id: existingPayment.id,
            transactionId: existingPayment.transactionId,
          };

        case PaymentStatus.FAILED:
          return {
            message: 'Previous payment attempt failed, retrying...',
            id: existingPayment.id,
            transactionId: existingPayment.transactionId,
          };

        default:
          return { message: 'Unknown payment status' };
      }
    }

    // Create a new payment record
    const payment = await this.paymentRepository.create({
      ...createPaymentDto,
      status: PaymentStatus.PROCESSING, // Default status
    });

    this.paymentQueue.addPaymentTask({
      id: payment?.id,
    });

    return {
      message: 'Started Payment Processing',
      id: payment.id,
      transactionId: payment.transactionId,
    };
  }

  async delete(id: string) {
    await this.findById(id);
    return this.paymentRepository.delete(id);
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    return this.paymentRepository.update(id, {
      status,
    });
  }
}
