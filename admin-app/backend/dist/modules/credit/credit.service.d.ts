import { Repository } from 'typeorm';
import { CreditRequest, CreditStatus } from '../../shared/entities/credit-request.entity';
import { User } from '../../shared/entities/user.entity';
export declare class CreditService {
    private creditRequestRepository;
    private userRepository;
    private readonly logger;
    constructor(creditRequestRepository: Repository<CreditRequest>, userRepository: Repository<User>);
    getPendingRequests(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            userId: string;
            user: {
                firstName: string;
                lastName: string;
                email: string;
                creditScore: number;
            };
            requestedAmount: number;
            approvedAmount: number;
            interestRate: number;
            termMonths: number;
            status: CreditStatus;
            purpose: string;
            rejectionReason: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getAllRequests(page?: number, limit?: number, status?: string): Promise<{
        data: {
            id: string;
            userId: string;
            user: {
                firstName: string;
                lastName: string;
                email: string;
                creditScore: number;
            };
            requestedAmount: number;
            approvedAmount: number;
            interestRate: number;
            termMonths: number;
            status: CreditStatus;
            purpose: string;
            rejectionReason: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    approveRequest(requestId: string, adminId: string, approvedAmount?: number): Promise<{
        message: string;
        request: {
            id: string;
            status: CreditStatus.ACTIVE;
            approvedAmount: number;
            approvedBy: string;
            approvedAt: Date;
            dueDate: Date;
        };
    }>;
    rejectRequest(requestId: string, adminId: string, reason: string): Promise<{
        message: string;
        request: {
            id: string;
            status: CreditStatus.REJECTED;
            rejectionReason: string;
            rejectedBy: string;
            rejectedAt: Date;
        };
    }>;
    getCreditStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        active: number;
        completed: number;
        totalDisbursed: number;
    }>;
    bulkApproveRequests(requestIds: string[], adminId: string, approvedAmounts?: {
        [requestId: string]: number;
    }): Promise<{
        message: string;
        successful: any[];
        failed: any[];
    }>;
    bulkRejectRequests(requestIds: string[], adminId: string, reason: string): Promise<{
        message: string;
        successful: any[];
        failed: any[];
    }>;
    searchCredits(filters: {
        status?: string;
        minAmount?: number;
        maxAmount?: number;
        minCreditScore?: number;
        maxCreditScore?: number;
        dateFrom?: Date;
        dateTo?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: string;
            userId: string;
            user: {
                firstName: string;
                lastName: string;
                email: string;
                creditScore: number;
            };
            requestedAmount: number;
            approvedAmount: number;
            interestRate: number;
            termMonths: number;
            status: CreditStatus;
            purpose: string;
            rejectionReason: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
