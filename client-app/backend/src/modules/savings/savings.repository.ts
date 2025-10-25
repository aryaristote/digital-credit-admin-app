import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SavingsAccount } from './entities/savings-account.entity';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';

@Injectable()
export class SavingsRepository {
  constructor(
    @InjectRepository(SavingsAccount)
    private readonly savingsAccountRepository: Repository<SavingsAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  async createAccount(userId: string, accountNumber: string, initialDeposit: number = 0): Promise<SavingsAccount> {
    const account = this.savingsAccountRepository.create({
      userId,
      accountNumber,
      balance: initialDeposit,
    });
    return await this.savingsAccountRepository.save(account);
  }

  async findByUserId(userId: string): Promise<SavingsAccount | null> {
    return await this.savingsAccountRepository.findOne({
      where: { userId },
    });
  }

  async findById(id: string): Promise<SavingsAccount | null> {
    return await this.savingsAccountRepository.findOne({
      where: { id },
    });
  }

  async updateBalance(accountId: string, amount: number): Promise<void> {
    await this.savingsAccountRepository
      .createQueryBuilder()
      .update(SavingsAccount)
      .set({ balance: () => `balance + ${amount}` })
      .where('id = :accountId', { accountId })
      .execute();
  }

  async createTransaction(
    savingsAccountId: string,
    type: TransactionType,
    amount: number,
    balanceAfter: number,
    description?: string,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      savingsAccountId,
      type,
      amount,
      balanceAfter,
      description,
      status: TransactionStatus.COMPLETED,
      reference: this.generateReference(),
    });
    return await this.transactionRepository.save(transaction);
  }

  async getTransactions(savingsAccountId: string, limit: number = 50): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { savingsAccountId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async executeDepositTransaction(
    savingsAccountId: string,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update balance
      await queryRunner.manager
        .createQueryBuilder()
        .update(SavingsAccount)
        .set({ balance: () => `balance + ${amount}` })
        .where('id = :savingsAccountId', { savingsAccountId })
        .execute();

      // Get updated balance
      const account = await queryRunner.manager.findOne(SavingsAccount, {
        where: { id: savingsAccountId },
      });

      // Create transaction record
      const transaction = queryRunner.manager.create(Transaction, {
        savingsAccountId,
        type: TransactionType.DEPOSIT,
        amount,
        balanceAfter: account.balance,
        description,
        status: TransactionStatus.COMPLETED,
        reference: this.generateReference(),
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async executeWithdrawalTransaction(
    savingsAccountId: string,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update balance
      await queryRunner.manager
        .createQueryBuilder()
        .update(SavingsAccount)
        .set({ balance: () => `balance - ${amount}` })
        .where('id = :savingsAccountId', { savingsAccountId })
        .execute();

      // Get updated balance
      const account = await queryRunner.manager.findOne(SavingsAccount, {
        where: { id: savingsAccountId },
      });

      // Create transaction record
      const transaction = queryRunner.manager.create(Transaction, {
        savingsAccountId,
        type: TransactionType.WITHDRAWAL,
        amount,
        balanceAfter: account.balance,
        description,
        status: TransactionStatus.COMPLETED,
        reference: this.generateReference(),
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `TXN-${timestamp}-${random}`;
  }
}

