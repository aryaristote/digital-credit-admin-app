import { User } from './user.entity';
export declare enum CreditStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    ACTIVE = "active",
    COMPLETED = "completed",
    DEFAULTED = "defaulted"
}
export declare class CreditRequest {
    id: string;
    userId: string;
    requestedAmount: number;
    approvedAmount: number;
    totalRepaid: number;
    interestRate: number;
    termMonths: number;
    status: CreditStatus;
    purpose: string;
    rejectionReason: string;
    approvedBy: string;
    approvedAt: Date;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
