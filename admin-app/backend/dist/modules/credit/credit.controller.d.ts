import { CreditService } from './credit.service';
export declare class CreditController {
    private readonly creditService;
    constructor(creditService: CreditService);
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
            status: import("../../shared/entities/credit-request.entity").CreditStatus;
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
            status: import("../../shared/entities/credit-request.entity").CreditStatus;
            purpose: string;
            rejectionReason: string;
            createdAt: Date;
        }[];
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
        request: {
            id: string;
            status: import("../../shared/entities/credit-request.entity").CreditStatus.ACTIVE;
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
            status: import("../../shared/entities/credit-request.entity").CreditStatus.REJECTED;
            rejectionReason: string;
            rejectedBy: string;
            rejectedAt: Date;
        };
    }>;
    bulkApprove(adminId: string, body: {
        requestIds: string[];
        approvedAmounts?: {
            [key: string]: number;
        };
    }): Promise<{
        message: string;
        successful: any[];
        failed: any[];
    }>;
    bulkReject(adminId: string, body: {
        requestIds: string[];
        reason: string;
    }): Promise<{
        message: string;
        successful: any[];
        failed: any[];
    }>;
    searchCredits(status?: string, minAmount?: number, maxAmount?: number, minCreditScore?: number, maxCreditScore?: number, dateFrom?: string, dateTo?: string, page?: number, limit?: number): Promise<{
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
            status: import("../../shared/entities/credit-request.entity").CreditStatus;
            purpose: string;
            rejectionReason: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
