import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../shared/entities/user.entity";
import {
  CreditRequest,
  CreditStatus,
} from "../../shared/entities/credit-request.entity";
import { SavingsAccount } from "../../shared/entities/savings-account.entity";
import { UserRole } from "../../common/enums/user-role.enum";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CreditRequest)
    private creditRepository: Repository<CreditRequest>,
    @InjectRepository(SavingsAccount)
    private savingsRepository: Repository<SavingsAccount>
  ) {}

  async getDashboardStats() {
    // User statistics
    const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.CUSTOMER } }),
      this.userRepository.count({
        where: { role: UserRole.CUSTOMER, isActive: true },
      }),
      this.userRepository
        .createQueryBuilder("user")
        .where("user.role = :role", { role: UserRole.CUSTOMER })
        .andWhere("user.createdAt >= :startOfMonth", {
          startOfMonth: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
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
      this.creditRepository.count({
        where: { status: CreditStatus.COMPLETED },
      }),
    ]);

    // Financial statistics
    const totalDisbursedResult = await this.creditRepository
      .createQueryBuilder("credit")
      .select("SUM(credit.approvedAmount)", "total")
      .where("credit.status IN (:...statuses)", {
        statuses: [CreditStatus.ACTIVE, CreditStatus.COMPLETED],
      })
      .getRawOne();

    const totalRepaidResult = await this.creditRepository
      .createQueryBuilder("credit")
      .select("SUM(credit.totalRepaid)", "total")
      .getRawOne();

    const totalSavingsResult = await this.savingsRepository
      .createQueryBuilder("savings")
      .select("SUM(savings.balance)", "total")
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
        totalDisbursed: parseFloat(totalDisbursedResult?.total || "0"),
        totalRepaid: parseFloat(totalRepaidResult?.total || "0"),
        totalSavings: parseFloat(totalSavingsResult?.total || "0"),
      },
    };
  }

  async getCreditScoreDistribution() {
    const distribution = await this.userRepository
      .createQueryBuilder("user")
      .select("FLOOR(user.creditScore / 50) * 50", "range")
      .addSelect("COUNT(*)", "count")
      .where("user.role = :role", { role: UserRole.CUSTOMER })
      .groupBy("range")
      .orderBy("range", "ASC")
      .getRawMany();

    return distribution.map((item) => ({
      range: `${item.range}-${parseInt(item.range) + 49}`,
      count: parseInt(item.count),
    }));
  }

  async getRecentActivity(limit: number = 10) {
    const recentCredits = await this.creditRepository.find({
      relations: ["user"],
      order: { createdAt: "DESC" },
      take: limit,
    });

    return recentCredits.map((credit) => ({
      type: "credit",
      user: `${credit.user.firstName} ${credit.user.lastName}`,
      action: `Requested ${credit.requestedAmount} credit`,
      status: credit.status,
      createdAt: credit.createdAt,
    }));
  }

  async getMonthlyLoanDisbursement() {
    console.log("📊 [ANALYTICS] Fetching monthly loan disbursement data...");

    // Get last 6 months of data
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - i,
        1
      );
      const monthEnd = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - i + 1,
        0,
        23,
        59,
        59,
        999
      );

      // Query for approved credits in this month
      // Use approvedAt if available, otherwise use createdAt as fallback
      const result = await this.creditRepository
        .createQueryBuilder("credit")
        .select("SUM(credit.approvedAmount)", "total")
        .where("credit.status IN (:...statuses)", {
          statuses: [CreditStatus.ACTIVE, CreditStatus.COMPLETED],
        })
        .andWhere("credit.approvedAmount > 0") // Only count actual disbursements
        .andWhere(
          "(credit.approvedAt >= :start AND credit.approvedAt <= :end) OR (credit.approvedAt IS NULL AND credit.createdAt >= :start AND credit.createdAt <= :end)",
          { start: monthStart, end: monthEnd }
        )
        .getRawOne();

      const amount = parseFloat(result?.total || "0");
      const monthLabel = monthStart.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      console.log(`📅 [ANALYTICS] ${monthLabel}: ${amount} (from database)`);

      months.push({
        month: monthLabel,
        amount: amount,
      });
    }

    console.log("✅ [ANALYTICS] Monthly disbursement data fetched:", months);
    return months;
  }

  async getCreditDistributionByScore() {
    const distribution = await this.userRepository
      .createQueryBuilder("user")
      .select("FLOOR(user.creditScore / 50) * 50", "range")
      .addSelect("COUNT(*)", "count")
      .where("user.role = :role", { role: UserRole.CUSTOMER })
      .groupBy("range")
      .orderBy("range", "ASC")
      .getRawMany();

    return distribution.map((item) => ({
      range: `${item.range}-${parseInt(item.range) + 49}`,
      count: parseInt(item.count),
      percentage: 0, // Will be calculated on frontend
    }));
  }

  async getPerformanceSummary() {
    // Total credits approved this month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const creditsThisMonth = await this.creditRepository
      .createQueryBuilder("credit")
      .where("credit.status IN (:...statuses)", {
        statuses: [CreditStatus.ACTIVE, CreditStatus.COMPLETED],
      })
      .andWhere("credit.approvedAt >= :start", { start: startOfMonth })
      .getCount();

    // Total amount disbursed this month
    const disbursedThisMonth = await this.creditRepository
      .createQueryBuilder("credit")
      .select("SUM(credit.approvedAmount)", "total")
      .where("credit.status IN (:...statuses)", {
        statuses: [CreditStatus.ACTIVE, CreditStatus.COMPLETED],
      })
      .andWhere("credit.approvedAt >= :start", { start: startOfMonth })
      .getRawOne();

    // Average credit score
    const avgCreditScore = await this.userRepository
      .createQueryBuilder("user")
      .select("AVG(user.creditScore)", "avg")
      .where("user.role = :role", { role: UserRole.CUSTOMER })
      .getRawOne();

    // Repayment rate (total repaid / total disbursed)
    const totalDisbursed = await this.creditRepository
      .createQueryBuilder("credit")
      .select("SUM(credit.approvedAmount)", "total")
      .where("credit.status IN (:...statuses)", {
        statuses: [CreditStatus.ACTIVE, CreditStatus.COMPLETED],
      })
      .getRawOne();

    const totalRepaid = await this.creditRepository
      .createQueryBuilder("credit")
      .select("SUM(credit.totalRepaid)", "total")
      .getRawOne();

    const totalDisbursedAmount = parseFloat(totalDisbursed?.total || "0");
    const totalRepaidAmount = parseFloat(totalRepaid?.total || "0");
    const repaymentRate =
      totalDisbursedAmount > 0
        ? (totalRepaidAmount / totalDisbursedAmount) * 100
        : 0;

    return {
      creditsApprovedThisMonth: creditsThisMonth,
      amountDisbursedThisMonth: parseFloat(disbursedThisMonth?.total || "0"),
      averageCreditScore: parseFloat(avgCreditScore?.avg || "0"),
      repaymentRate: repaymentRate,
      totalActiveLoans: await this.creditRepository.count({
        where: { status: CreditStatus.ACTIVE },
      }),
      totalCompletedLoans: await this.creditRepository.count({
        where: { status: CreditStatus.COMPLETED },
      }),
    };
  }
}
