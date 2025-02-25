import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entitys';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findOne({ where: { id } });
  }

  async find(payment: FindOneOptions<Payment>): Promise<Payment | null> {
    return this.paymentRepository.findOne(payment);
  }

  async create(payment: Partial<Payment>): Promise<Payment> {
    return this.paymentRepository.save(payment);
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment | null> {
    await this.paymentRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.paymentRepository.delete(id);
  }
}
