import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Payment amount

  @Column({ type: 'varchar', length: 3 })
  currency: string; // ISO currency code (USD, EUR, etc.)

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PROCESSING,
  })
  status: PaymentStatus; // Payment state

  @Column({ type: 'varchar', nullable: true })
  transactionId: string; // External payment provider transaction ID

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: string; // E.g., 'credit_card', 'paypal', 'crypto'

  @Column({ type: 'text', nullable: true })
  metadata: string; // Store extra data (e.g., JSON string)

  @Column({ type: 'boolean', default: false })
  refunded: boolean; // If payment has been refunded

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
