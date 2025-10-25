import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreditRequest } from './credit-request.entity';

export enum RepaymentStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

@Entity('credit_repayments')
export class CreditRepayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creditRequestId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: RepaymentStatus,
    default: RepaymentStatus.COMPLETED,
  })
  status: RepaymentStatus;

  @Column({ nullable: true })
  reference: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CreditRequest, (creditRequest) => creditRequest.repayments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creditRequestId' })
  creditRequest: CreditRequest;
}

