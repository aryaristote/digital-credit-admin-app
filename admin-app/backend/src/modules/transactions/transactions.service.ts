import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from '../../shared/entities/transaction.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(SavingsAccount)
    private savingsAccountRepository: Repository<SavingsAccount>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllTransactions(page: number = 1, limit: number = 50, type?: string) {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.savingsAccount', 'savingsAccount')
      .leftJoinAndSelect('savingsAccount.user', 'user')
      .orderBy('transaction.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    const [transactions, total] = await queryBuilder.getManyAndCount();

    return {
      data: transactions.map((txn) => ({
        id: txn.id,
        userId: txn.savingsAccount?.user?.id,
        user: txn.savingsAccount?.user
          ? {
              firstName: txn.savingsAccount.user.firstName,
              lastName: txn.savingsAccount.user.lastName,
              email: txn.savingsAccount.user.email,
            }
          : null,
        type: txn.type,
        amount: Number(txn.amount),
        balanceAfter: Number(txn.balanceAfter),
        status: txn.status,
        description: txn.description,
        reference: txn.reference,
        createdAt: txn.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTransactionStats() {
    const totalDepositsResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.type = :type', { type: 'deposit' })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .getRawOne();

    const totalWithdrawalsResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.type = :type', { type: 'withdrawal' })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .getRawOne();

    const [totalCount, pendingCount, completedCount, failedCount] = await Promise.all([
      this.transactionRepository.count(),
      this.transactionRepository.count({ where: { status: TransactionStatus.PENDING } }),
      this.transactionRepository.count({ where: { status: TransactionStatus.COMPLETED } }),
      this.transactionRepository.count({ where: { status: TransactionStatus.FAILED } }),
    ]);

    return {
      totalDeposits: parseFloat(totalDepositsResult?.total || '0'),
      totalWithdrawals: parseFloat(totalWithdrawalsResult?.total || '0'),
      totalCount,
      pendingCount,
      completedCount,
      failedCount,
    };
  }
}

