import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { CreditRequest, CreditStatus } from '../../shared/entities/credit-request.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';
export declare class AnalyticsService {
    private userRepository;
    private creditRepository;
    private savingsRepository;
    constructor(userRepository: Repository<User>, creditRepository: Repository<CreditRequest>, savingsRepository: Repository<SavingsAccount>);
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
        status: CreditStatus;
        createdAt: Date;
    }[]>;
}
