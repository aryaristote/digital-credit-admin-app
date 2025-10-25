import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreditRequest, CreditStatus } from './entities/credit-request.entity';
import { CreditRepayment, RepaymentStatus } from './entities/credit-repayment.entity';

@Injectable()
export class CreditRepository {
  constructor(
    @InjectRepository(CreditRequest)
    private readonly creditRequestRepository: Repository<CreditRequest>,
    @InjectRepository(CreditRepayment)
    private readonly creditRepaymentRepository: Repository<CreditRepayment>,
    private readonly dataSource: DataSource,
  ) {}

  async createCreditRequest(data: Partial<CreditRequest>): Promise<CreditRequest> {
    const creditRequest = this.creditRequestRepository.create(data);
    return await this.creditRequestRepository.save(creditRequest);
  }

  async findById(id: string): Promise<CreditRequest | null> {
    return await this.creditRequestRepository.findOne({
      where: { id },
      relations: ['repayments'],
    });
  }

  async findByUserId(userId: string): Promise<CreditRequest[]> {
    return await this.creditRequestRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['repayments'],
    });
  }

  async findActiveByUserId(userId: string): Promise<CreditRequest[]> {
    return await this.creditRequestRepository.find({
      where: {
        userId,
        status: CreditStatus.ACTIVE,
      },
    });
  }

  async updateStatus(
    id: string,
    status: CreditStatus,
    additionalData?: Partial<CreditRequest>,
  ): Promise<void> {
    await this.creditRequestRepository.update(id, {
      status,
      ...additionalData,
    });
  }

  async createRepayment(data: Partial<CreditRepayment>): Promise<CreditRepayment> {
    const repayment = this.creditRepaymentRepository.create(data);
    return await this.creditRepaymentRepository.save(repayment);
  }

  async executeRepayment(
    creditRequestId: string,
    amount: number,
    notes?: string,
  ): Promise<CreditRepayment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update total repaid
      await queryRunner.manager
        .createQueryBuilder()
        .update(CreditRequest)
        .set({ totalRepaid: () => `"totalRepaid" + ${amount}` })
        .where('id = :creditRequestId', { creditRequestId })
        .execute();

      // Get updated credit request
      const creditRequest = await queryRunner.manager.findOne(CreditRequest, {
        where: { id: creditRequestId },
      });

      // Create repayment record
      const repayment = queryRunner.manager.create(CreditRepayment, {
        creditRequestId,
        amount,
        notes,
        status: RepaymentStatus.COMPLETED,
        reference: this.generateReference(),
      });

      const savedRepayment = await queryRunner.manager.save(repayment);

      // Check if loan is fully repaid
      const totalOwed =
        Number(creditRequest.approvedAmount) *
        (1 + Number(creditRequest.interestRate) / 100);
      if (Number(creditRequest.totalRepaid) >= totalOwed) {
        await queryRunner.manager.update(CreditRequest, creditRequestId, {
          status: CreditStatus.COMPLETED,
        });
      }

      await queryRunner.commitTransaction();
      return savedRepayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getRepayments(creditRequestId: string): Promise<CreditRepayment[]> {
    return await this.creditRepaymentRepository.find({
      where: { creditRequestId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteCreditRequest(id: string): Promise<void> {
    await this.creditRequestRepository.delete(id);
  }

  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `RPY-${timestamp}-${random}`;
  }
}

