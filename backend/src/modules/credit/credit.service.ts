import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreditRequest, CreditStatus } from '../../shared/entities/credit-request.entity';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(CreditRequest)
    private creditRequestRepository: Repository<CreditRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getPendingRequests(page: number = 1, limit: number = 10) {
    const [requests, total] = await this.creditRequestRepository.findAndCount({
      where: { status: CreditStatus.PENDING },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    return {
      data: requests.map((req) => ({
        id: req.id,
        user: {
          id: req.user.id,
          name: `${req.user.firstName} ${req.user.lastName}`,
          email: req.user.email,
          creditScore: req.user.creditScore,
        },
        requestedAmount: req.requestedAmount,
        termMonths: req.termMonths,
        purpose: req.purpose,
        interestRate: req.interestRate,
        createdAt: req.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllRequests(page: number = 1, limit: number = 10, status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [requests, total] = await this.creditRequestRepository.findAndCount({
      where,
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveRequest(requestId: string, adminId: string, approvedAmount?: number) {
    const request = await this.creditRequestRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Credit request not found');
    }

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + request.termMonths);

    request.status = CreditStatus.ACTIVE;
    request.approvedAmount = approvedAmount || request.requestedAmount;
    request.approvedBy = adminId;
    request.approvedAt = new Date();
    request.dueDate = dueDate;

    await this.creditRequestRepository.save(request);

    return { message: 'Credit request approved successfully', request };
  }

  async rejectRequest(requestId: string, adminId: string, reason: string) {
    const request = await this.creditRequestRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Credit request not found');
    }

    request.status = CreditStatus.REJECTED;
    request.rejectionReason = reason;
    request.approvedBy = adminId;

    await this.creditRequestRepository.save(request);

    return { message: 'Credit request rejected', request };
  }

  async getCreditStats() {
    const [total, pending, approved, rejected, active, completed] = await Promise.all([
      this.creditRequestRepository.count(),
      this.creditRequestRepository.count({ where: { status: CreditStatus.PENDING } }),
      this.creditRequestRepository.count({ where: { status: CreditStatus.APPROVED } }),
      this.creditRequestRepository.count({ where: { status: CreditStatus.REJECTED } }),
      this.creditRequestRepository.count({ where: { status: CreditStatus.ACTIVE } }),
      this.creditRequestRepository.count({ where: { status: CreditStatus.COMPLETED } }),
    ]);

    const totalAmountResult = await this.creditRequestRepository
      .createQueryBuilder('credit')
      .select('SUM(credit.approvedAmount)', 'total')
      .where('credit.status IN (:...statuses)', { statuses: [CreditStatus.ACTIVE, CreditStatus.COMPLETED] })
      .getRawOne();

    return {
      total,
      pending,
      approved,
      rejected,
      active,
      completed,
      totalDisbursed: parseFloat(totalAmountResult?.total || '0'),
    };
  }
}

