import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';
import { UserRole } from '../../common/enums/user-role.enum';
export declare class UsersService {
    private userRepository;
    private savingsRepository;
    constructor(userRepository: Repository<User>, savingsRepository: Repository<SavingsAccount>);
    getAllUsers(page?: number, limit?: number): Promise<{
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
        savingsAccount: SavingsAccount;
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        dateOfBirth: Date;
        address: string;
        role: UserRole;
        isActive: boolean;
        creditScore: number;
        refreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleUserStatus(userId: string): Promise<{
        message: string;
    }>;
    updateCreditScore(userId: string, creditScore: number): Promise<{
        message: string;
    }>;
}
