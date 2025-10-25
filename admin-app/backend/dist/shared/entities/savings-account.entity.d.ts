import { User } from './user.entity';
export declare class SavingsAccount {
    id: string;
    userId: string;
    accountNumber: string;
    balance: number;
    interestRate: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
