import { AnalyticsService } from "./analytics.service";
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            active: number;
            newThisMonth: number;
        };
        credits: {
            total: number;
            pending: number;
            active: number;
            completed: number;
        };
        financials: {
            totalDisbursed: number;
            totalRepaid: number;
            totalSavings: number;
        };
    }>;
    getCreditScoreDistribution(): Promise<{
        range: string;
        count: number;
    }[]>;
    getRecentActivity(limit?: number): Promise<{
        type: string;
        user: string;
        action: string;
        status: import("../../shared/entities/credit-request.entity").CreditStatus;
        createdAt: Date;
    }[]>;
    getMonthlyLoanDisbursement(): Promise<any[]>;
    getCreditDistributionByScore(): Promise<{
        range: string;
        count: number;
        percentage: number;
    }[]>;
    getPerformanceSummary(): Promise<{
        creditsApprovedThisMonth: number;
        amountDisbursedThisMonth: number;
        averageCreditScore: number;
        repaymentRate: number;
        totalActiveLoans: number;
        totalCompletedLoans: number;
    }>;
}
