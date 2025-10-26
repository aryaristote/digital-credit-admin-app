import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditRequest, CreditStatus } from '../../shared/entities/credit-request.entity';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class CreditService {
  private readonly logger = new Logger(CreditService.name);

  constructor(
    @InjectRepository(CreditRequest)
    private creditRequestRepository: Repository<CreditRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getPendingRequests(page: number = 1, limit: number = 10) {
    // Ensure page and limit are valid numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const [requests, total] = await this.creditRequestRepository.findAndCount({
      where: { status: CreditStatus.PENDING },
      relations: ['user'],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      order: { createdAt: 'ASC' },
    });

    return {
      data: requests.map((req) => ({
        id: req.id,
        userId: req.user.id,
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          creditScore: req.user.creditScore,
        },
        requestedAmount: Number(req.requestedAmount),
        approvedAmount: req.approvedAmount ? Number(req.approvedAmount) : 0,
        interestRate: Number(req.interestRate),
        termMonths: req.termMonths,
        status: req.status,
        purpose: req.purpose,
        rejectionReason: req.rejectionReason,
        createdAt: req.createdAt,
      })),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async getAllRequests(page: number = 1, limit: number = 10, status?: string) {
    // Ensure page and limit are valid numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [requests, total] = await this.creditRequestRepository.findAndCount({
      where,
      relations: ['user'],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      order: { createdAt: 'DESC' },
    });

    return {
      data: requests.map((req) => ({
        id: req.id,
        userId: req.user.id,
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          creditScore: req.user.creditScore,
        },
        requestedAmount: Number(req.requestedAmount),
        approvedAmount: req.approvedAmount ? Number(req.approvedAmount) : 0,
        interestRate: Number(req.interestRate),
        termMonths: req.termMonths,
        status: req.status,
        purpose: req.purpose,
        rejectionReason: req.rejectionReason,
        createdAt: req.createdAt,
      })),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async approveRequest(requestId: string, adminId: string, approvedAmount?: number) {
    this.logger.log(`Processing approval for request ${requestId} by admin ${adminId}`);

    const request = await this.creditRequestRepository.findOne({
      where: { id: requestId },
      relations: ['user'],
    });

    if (!request) {
      this.logger.warn(`Credit request not found: ${requestId}`);
      throw new NotFoundException('Credit request not found');
    }

    if (request.status !== CreditStatus.PENDING) {
      this.logger.warn(
        `Cannot approve request ${requestId} with status: ${request.status}`,
      );
      throw new BadRequestException(
        `Cannot approve request with status: ${request.status}. Only pending requests can be approved.`,
      );
    }

    const finalAmount = approvedAmount || request.requestedAmount;
    if (finalAmount <= 0) {
      throw new BadRequestException('Approved amount must be greater than 0');
    }

    if (approvedAmount && approvedAmount > request.requestedAmount) {
      throw new BadRequestException('Approved amount cannot exceed requested amount');
    }

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + request.termMonths);

    request.status = CreditStatus.ACTIVE;
    request.approvedAmount = finalAmount;
    request.approvedBy = adminId;
    request.approvedAt = new Date();
    request.dueDate = dueDate;

    await this.creditRequestRepository.save(request);

    this.logger.log(
      `Credit request ${requestId} approved: ${finalAmount} at ${request.interestRate}% interest`,
    );

    return {
      message: 'Credit request approved successfully',
      request: {
        id: request.id,
        status: request.status,
        approvedAmount: request.approvedAmount,
        approvedBy: request.approvedBy,
        approvedAt: request.approvedAt,
        dueDate: request.dueDate,
      },
    };
  }

  async rejectRequest(requestId: string, adminId: string, reason: string) {
    this.logger.log(`Processing rejection for request ${requestId} by admin ${adminId}`);

    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Rejection reason is required');
    }

    const request = await this.creditRequestRepository.findOne({
      where: { id: requestId },
      relations: ['user'],
    });

    if (!request) {
      this.logger.warn(`Credit request not found: ${requestId}`);
      throw new NotFoundException('Credit request not found');
    }

    if (request.status !== CreditStatus.PENDING) {
      this.logger.warn(
        `Cannot reject request ${requestId} with status: ${request.status}`,
      );
      throw new BadRequestException(
        `Cannot reject request with status: ${request.status}. Only pending requests can be rejected.`,
      );
    }

    request.status = CreditStatus.REJECTED;
    request.rejectionReason = reason.trim();
    request.approvedBy = adminId;
    request.approvedAt = new Date();

    await this.creditRequestRepository.save(request);

    this.logger.log(`Credit request ${requestId} rejected by admin ${adminId}`);

    return {
      message: 'Credit request rejected',
      request: {
        id: request.id,
        status: request.status,
        rejectionReason: request.rejectionReason,
        rejectedBy: request.approvedBy,
        rejectedAt: request.approvedAt,
      },
    };
  }

  async getCreditStats() {
    const [total, pending, approved, rejected, active, completed] = await Promise.all([
      this.creditRequestRepository.count(),
      this.creditRequestRepository.count({
        where: { status: CreditStatus.PENDING },
      }),
      this.creditRequestRepository.count({
        where: { status: CreditStatus.APPROVED },
      }),
      this.creditRequestRepository.count({
        where: { status: CreditStatus.REJECTED },
      }),
      this.creditRequestRepository.count({
        where: { status: CreditStatus.ACTIVE },
      }),
      this.creditRequestRepository.count({
        where: { status: CreditStatus.COMPLETED },
      }),
    ]);

    const totalAmountResult = await this.creditRequestRepository
      .createQueryBuilder('credit')
      .select('SUM(credit.approvedAmount)', 'total')
      .where('credit.status IN (:...statuses)', {
        statuses: [CreditStatus.ACTIVE, CreditStatus.COMPLETED],
      })
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

  /**
   * Bulk approve credit requests
   */
  async bulkApproveRequests(
    requestIds: string[],
    adminId: string,
    approvedAmounts?: { [requestId: string]: number },
  ) {
    this.logger.log(`Bulk approving ${requestIds.length} credit requests`);

    const results = {
      successful: [],
      failed: [],
    };

    for (const requestId of requestIds) {
      try {
        const approvedAmount = approvedAmounts?.[requestId];
        const result = await this.approveRequest(requestId, adminId, approvedAmount);
        results.successful.push({
          requestId,
          ...result.request,
        });
      } catch (error) {
        this.logger.error(`Failed to approve request ${requestId}: ${error.message}`);
        results.failed.push({
          requestId,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Bulk approval completed: ${results.successful.length} succeeded, ${results.failed.length} failed`,
    );

    return {
      message: `Bulk approval completed: ${results.successful.length} succeeded, ${results.failed.length} failed`,
      successful: results.successful,
      failed: results.failed,
    };
  }

  /**
   * Bulk reject credit requests
   */
  async bulkRejectRequests(requestIds: string[], adminId: string, reason: string) {
    this.logger.log(`Bulk rejecting ${requestIds.length} credit requests`);

    const results = {
      successful: [],
      failed: [],
    };

    for (const requestId of requestIds) {
      try {
        const result = await this.rejectRequest(requestId, adminId, reason);
        results.successful.push({
          requestId,
          ...result.request,
        });
      } catch (error) {
        this.logger.error(`Failed to reject request ${requestId}: ${error.message}`);
        results.failed.push({
          requestId,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Bulk rejection completed: ${results.successful.length} succeeded, ${results.failed.length} failed`,
    );

    return {
      message: `Bulk rejection completed: ${results.successful.length} succeeded, ${results.failed.length} failed`,
      successful: results.successful,
      failed: results.failed,
    };
  }

  /**
   * Advanced search with filters
   */
  async searchCredits(filters: {
    status?: string;
    minAmount?: number;
    maxAmount?: number;
    minCreditScore?: number;
    maxCreditScore?: number;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      status,
      minAmount,
      maxAmount,
      minCreditScore,
      maxCreditScore,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = filters;

    const queryBuilder = this.creditRequestRepository
      .createQueryBuilder('credit')
      .leftJoinAndSelect('credit.user', 'user')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('credit.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('credit.status = :status', { status });
    }

    if (minAmount !== undefined) {
      queryBuilder.andWhere('credit.requestedAmount >= :minAmount', { minAmount });
    }

    if (maxAmount !== undefined) {
      queryBuilder.andWhere('credit.requestedAmount <= :maxAmount', { maxAmount });
    }

    if (minCreditScore !== undefined) {
      queryBuilder.andWhere('user.creditScore >= :minCreditScore', { minCreditScore });
    }

    if (maxCreditScore !== undefined) {
      queryBuilder.andWhere('user.creditScore <= :maxCreditScore', { maxCreditScore });
    }

    if (dateFrom) {
      queryBuilder.andWhere('credit.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('credit.createdAt <= :dateTo', { dateTo });
    }

    const [requests, total] = await queryBuilder.getManyAndCount();

    return {
      data: requests.map((req) => ({
        id: req.id,
        userId: req.user.id,
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          creditScore: req.user.creditScore,
        },
        requestedAmount: Number(req.requestedAmount),
        approvedAmount: req.approvedAmount ? Number(req.approvedAmount) : 0,
        interestRate: Number(req.interestRate),
        termMonths: req.termMonths,
        status: req.status,
        purpose: req.purpose,
        rejectionReason: req.rejectionReason,
        createdAt: req.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
