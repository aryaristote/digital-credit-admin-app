import { UserRole } from '../../common/enums/user-role.enum';
export declare class User {
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
}
