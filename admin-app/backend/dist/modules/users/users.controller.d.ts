import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            creditScore: number;
            isActive: boolean;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getUserDetails(userId: string): Promise<{
        savingsAccount: import("../../shared/entities/savings-account.entity").SavingsAccount;
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        dateOfBirth: Date;
        address: string;
        role: import("../../common/enums/user-role.enum").UserRole;
        isActive: boolean;
        creditScore: number;
        refreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleStatus(userId: string): Promise<{
        message: string;
    }>;
    updateCreditScore(userId: string, creditScore: number): Promise<{
        message: string;
    }>;
}
