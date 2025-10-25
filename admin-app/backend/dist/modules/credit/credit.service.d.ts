import { Repository } from 'typeorm';
import { CreditRequest } from '../../shared/entities/credit-request.entity';
import { User } from '../../shared/entities/user.entity';
export declare class CreditService {
    private creditRequestRepository;
    private userRepository;
    constructor(creditRequestRepository: Repository<CreditRequest>, userRepository: Repository<User>);
    getPendingRequests(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            user: {
                id: string;
                name: string;
                email: string;
                creditScore: number;
            };
            requestedAmount: number;
            termMonths: number;
            purpose: string;
            interestRate: number;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getAllRequests(page?: number, limit?: number, status?: string): Promise<{
        data: CreditRequest[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    approveRequest(requestId: string, adminId: string, approvedAmount?: number): Promise<{
        message: string;
        request: CreditRequest;
    }>;
    rejectRequest(requestId: string, adminId: string, reason: string): Promise<{
        message: string;
        request: CreditRequest;
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
}
