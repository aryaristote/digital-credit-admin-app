import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from './transaction.entity';

@Entity('savings_accounts')
export class SavingsAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  accountNumber: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column('decimal', { precision: 5, scale: 2, default: 2.5 })
  interestRate: number;

  @Column({ default: 'active' })
  status: string; // active, frozen, closed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.savingsAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.savingsAccount)
  transactions: Transaction[];
}

