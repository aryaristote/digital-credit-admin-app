"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../shared/entities/user.entity");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(email, password) {
        this.logger.log(`Login attempt for: ${email}`);
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                this.logger.warn(`Login failed: User not found - ${email}`);
                throw new common_1.UnauthorizedException('Invalid credentials or not an admin');
            }
            if (user.role !== user_role_enum_1.UserRole.ADMIN) {
                this.logger.warn(`Login failed: User is not an admin - ${email}`);
                throw new common_1.UnauthorizedException('Invalid credentials or not an admin');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                this.logger.warn(`Login failed: Invalid password - ${email}`);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (!user.isActive) {
                this.logger.warn(`Login failed: Account deactivated - ${email}`);
                throw new common_1.UnauthorizedException('Account is deactivated');
            }
            const accessToken = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role,
            });
            this.logger.log(`Login successful for: ${email}`);
            return {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Login error: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException('Authentication failed');
        }
    }
    async validateUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || user.role !== user_role_enum_1.UserRole.ADMIN || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid user or not an admin');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map