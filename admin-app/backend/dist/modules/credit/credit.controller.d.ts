import { CreditService } from './credit.service';
export declare class CreditController {
    private readonly creditService;
    constructor(creditService: CreditService);
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
        data: import("../../shared/entities/credit-request.entity").CreditRequest[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        active: number;
        completed: number;
        totalDisbursed: number;
    }>;
    approveRequest(requestId: string, adminId: string, approvedAmount?: number): Promise<{
        message: string;
        request: import("../../shared/entities/credit-request.entity").CreditRequest;
    }>;
    rejectRequest(requestId: string, adminId: string, reason: string): Promise<{
        message: string;
        request: import("../../shared/entities/credit-request.entity").CreditRequest;
    }>;
}
