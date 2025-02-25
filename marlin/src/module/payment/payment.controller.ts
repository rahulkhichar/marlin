import { Controller, Post, Body, Inject, Get, Query } from '@nestjs/common';
import { PaymentQueue } from './queue/payment.queue';
import { CreatePaymentDto } from './dtos';
import { PaymentService } from './services/payment.service';

@Controller('v1/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() body: CreatePaymentDto) {
    return await this.paymentService.create(body);
  }

  @Get()
  async getPaymentStatus(@Query('id') id: string) {
    return await this.paymentService.findById(id);
  }
}
