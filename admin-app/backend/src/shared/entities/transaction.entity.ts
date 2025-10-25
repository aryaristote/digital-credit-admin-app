import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SavingsAccount } from './savings-account.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  INTEREST = 'interest',
  FEE = 'fee',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  savingsAccountId: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 15, scale: 2 })
  balanceAfter: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  reference: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => SavingsAccount,
    (savingsAccount) => savingsAccount.transactions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'savingsAccountId' })
  savingsAccount: SavingsAccount;
}

