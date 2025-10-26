"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../shared/entities/user.entity");
const credit_request_entity_1 = require("../../shared/entities/credit-request.entity");
const savings_account_entity_1 = require("../../shared/entities/savings-account.entity");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let AnalyticsService = class AnalyticsService {
    constructor(userRepository, creditRepository, savingsRepository) {
        this.userRepository = userRepository;
        this.creditRepository = creditRepository;
        this.savingsRepository = savingsRepository;
    }
    async getDashboardStats() {
        const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
            this.userRepository.count({ where: { role: user_role_enum_1.UserRole.CUSTOMER } }),
            this.userRepository.count({
                where: { role: user_role_enum_1.UserRole.CUSTOMER, isActive: true },
            }),
            this.userRepository
                .createQueryBuilder("user")
                .where("user.role = :role", { role: user_role_enum_1.UserRole.CUSTOMER })
                .andWhere("user.createdAt >= :startOfMonth", {
                startOfMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            })
                .getCount(),
        ]);
        const [totalCreditRequests, pendingCredits, activeCredits, completedCredits,] = await Promise.all([
            this.creditRepository.count(),
            this.creditRepository.count({ where: { status: credit_request_entity_1.CreditStatus.PENDING } }),
            this.creditRepository.count({ where: { status: credit_request_entity_1.CreditStatus.ACTIVE } }),
            this.creditRepository.count({
                where: { status: credit_request_entity_1.CreditStatus.COMPLETED },
            }),
        ]);
        const totalDisbursedResult = await this.creditRepository
            .createQueryBuilder("credit")
            .select("SUM(credit.approvedAmount)", "total")
            .where("credit.status IN (:...statuses)", {
            statuses: [credit_request_entity_1.CreditStatus.ACTIVE, credit_request_entity_1.CreditStatus.COMPLETED],
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
            .where("user.role = :role", { role: user_role_enum_1.UserRole.CUSTOMER })
            .groupBy("range")
            .orderBy("range", "ASC")
            .getRawMany();
        return distribution.map((item) => ({
            range: `${item.range}-${parseInt(item.range) + 49}`,
            count: parseInt(item.count),
        }));
    }
    async getRecentActivity(limit = 10) {
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
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
            const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() - i + 1, 0, 23, 59, 59, 999);
            const result = await this.creditRepository
                .createQueryBuilder("credit")
                .select("SUM(credit.approvedAmount)", "total")
                .where("credit.status IN (:...statuses)", {
                statuses: [credit_request_entity_1.CreditStatus.ACTIVE, credit_request_entity_1.CreditStatus.COMPLETED],
            })
                .andWhere("credit.approvedAmount > 0")
                .andWhere("(credit.approvedAt >= :start AND credit.approvedAt <= :end) OR (credit.approvedAt IS NULL AND credit.createdAt >= :start AND credit.createdAt <= :end)", { start: monthStart, end: monthEnd })
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
            .where("user.role = :role", { role: user_role_enum_1.UserRole.CUSTOMER })
            .groupBy("range")
            .orderBy("range", "ASC")
            .getRawMany();
        return distribution.map((item) => ({
            range: `${item.range}-${parseInt(item.range) + 49}`,
            count: parseInt(item.count),
            percentage: 0,
        }));
    }
    async getPerformanceSummary() {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const creditsThisMonth = await this.creditRepository
            .createQueryBuilder("credit")
            .where("credit.status IN (:...statuses)", {
            statuses: [credit_request_entity_1.CreditStatus.ACTIVE, credit_request_entity_1.CreditStatus.COMPLETED],
        })
            .andWhere("credit.approvedAt >= :start", { start: startOfMonth })
            .getCount();
        const disbursedThisMonth = await this.creditRepository
            .createQueryBuilder("credit")
            .select("SUM(credit.approvedAmount)", "total")
            .where("credit.status IN (:...statuses)", {
            statuses: [credit_request_entity_1.CreditStatus.ACTIVE, credit_request_entity_1.CreditStatus.COMPLETED],
        })
            .andWhere("credit.approvedAt >= :start", { start: startOfMonth })
            .getRawOne();
        const avgCreditScore = await this.userRepository
            .createQueryBuilder("user")
            .select("AVG(user.creditScore)", "avg")
            .where("user.role = :role", { role: user_role_enum_1.UserRole.CUSTOMER })
            .getRawOne();
        const totalDisbursed = await this.creditRepository
            .createQueryBuilder("credit")
            .select("SUM(credit.approvedAmount)", "total")
            .where("credit.status IN (:...statuses)", {
            statuses: [credit_request_entity_1.CreditStatus.ACTIVE, credit_request_entity_1.CreditStatus.COMPLETED],
        })
            .getRawOne();
        const totalRepaid = await this.creditRepository
            .createQueryBuilder("credit")
            .select("SUM(credit.totalRepaid)", "total")
            .getRawOne();
        const totalDisbursedAmount = parseFloat(totalDisbursed?.total || "0");
        const totalRepaidAmount = parseFloat(totalRepaid?.total || "0");
        const repaymentRate = totalDisbursedAmount > 0
            ? (totalRepaidAmount / totalDisbursedAmount) * 100
            : 0;
        return {
            creditsApprovedThisMonth: creditsThisMonth,
            amountDisbursedThisMonth: parseFloat(disbursedThisMonth?.total || "0"),
            averageCreditScore: parseFloat(avgCreditScore?.avg || "0"),
            repaymentRate: repaymentRate,
            totalActiveLoans: await this.creditRepository.count({
                where: { status: credit_request_entity_1.CreditStatus.ACTIVE },
            }),
            totalCompletedLoans: await this.creditRepository.count({
                where: { status: credit_request_entity_1.CreditStatus.COMPLETED },
            }),
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(credit_request_entity_1.CreditRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(savings_account_entity_1.SavingsAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map