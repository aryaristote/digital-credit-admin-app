import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { CreditRequest, CreditStatus } from '../../shared/entities/credit-request.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CreditRequest)
    private creditRepository: Repository<CreditRequest>,
    @InjectRepository(SavingsAccount)
    private savingsRepository: Repository<SavingsAccount>,
  ) {}

  async getDashboardStats() {
    // User statistics
    const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.CUSTOMER } }),
      this.userRepository.count({ where: { role: UserRole.CUSTOMER, isActive: true } }),
      this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: UserRole.CUSTOMER })
        .andWhere('user.createdAt >= :startOfMonth', {
          startOfMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        })
        .getCount(),
    ]);

    // Credit statistics
    const [
      totalCreditRequests,
      pendingCredits,
      activeCredits,
      completedCredits,
    ] = await Promise.all([
      this.creditRepository.count(),
      this.creditRepository.count({ where: { status: CreditStatus.PENDING } }),
      this.creditRepository.count({ where: { status: CreditStatus.ACTIVE } }),
      this.creditRepository.count({ where: { status: CreditStatus.COMPLETED } }),
    ]);

    // Financial statistics
    const totalDisbursedResult = await this.creditRepository
      .createQueryBuilder('credit')
      .select('SUM(credit.approvedAmount)', 'total')
      .where('credit.status IN (:...statuses)', {
        statuses: [CreditStatus.ACTIVE, CreditStatus.COMPLETED],
      })
      .getRawOne();

    const totalRepaidResult = await this.creditRepository
      .createQueryBuilder('credit')
      .select('SUM(credit.totalRepaid)', 'total')
      .getRawOne();

    const totalSavingsResult = await this.savingsRepository
      .createQueryBuilder('savings')
      .select('SUM(savings.balance)', 'total')
      .getRawOne();

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
      },
      credits: {
        total: totalCreditRequests,
        pending: pendingCredits,
        active: activeCredits,
        completed: completedCredits,
      },
      financials: {
        totalDisbursed: parseFloat(totalDisbursedResult?.total || '0'),
        totalRepaid: parseFloat(totalRepaidResult?.total || '0'),
        totalSavings: parseFloat(totalSavingsResult?.total || '0'),
      },
    };
  }

  async getCreditScoreDistribution() {
    const distribution = await this.userRepository
      .createQueryBuilder('user')
      .select('FLOOR(user.creditScore / 50) * 50', 'range')
      .addSelect('COUNT(*)', 'count')
      .where('user.role = :role', { role: UserRole.CUSTOMER })
      .groupBy('range')
      .orderBy('range', 'ASC')
      .getRawMany();

    return distribution.map((item) => ({
      range: `${item.range}-${parseInt(item.range) + 49}`,
      count: parseInt(item.count),
    }));
  }

  async getRecentActivity(limit: number = 10) {
    const recentCredits = await this.creditRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return recentCredits.map((credit) => ({
      type: 'credit',
      user: `${credit.user.firstName} ${credit.user.lastName}`,
      action: `Requested ${credit.requestedAmount} credit`,
      status: credit.status,
      createdAt: credit.createdAt,
    }));
  }
}

