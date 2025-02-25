import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  transactionId: string;

  @IsNotEmpty()
  paymentMethod: string;
}
