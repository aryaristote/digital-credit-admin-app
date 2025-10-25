import { AuthService } from "./auth.service";
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../../common/enums/user-role.enum").UserRole.ADMIN;
        };
    }>;
}
export {};
