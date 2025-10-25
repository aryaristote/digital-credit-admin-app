import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CreditRepayment } from './credit-repayment.entity';

export enum CreditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted',
}

@Entity('credit_requests')
export class CreditRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  requestedAmount: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  approvedAmount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalRepaid: number;

  @Column('decimal', { precision: 5, scale: 2 })
  interestRate: number;

  @Column({ type: 'int' })
  termMonths: number;

  @Column({
    type: 'enum',
    enum: CreditStatus,
    default: CreditStatus.PENDING,
  })
  status: CreditStatus;

  @Column({ nullable: true })
  purpose: string;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.creditRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CreditRepayment, (repayment) => repayment.creditRequest)
  repayments: CreditRepayment[];
}

