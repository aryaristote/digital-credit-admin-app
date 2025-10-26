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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../shared/entities/user.entity");
const savings_account_entity_1 = require("../../shared/entities/savings-account.entity");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, savingsRepository) {
        this.userRepository = userRepository;
        this.savingsRepository = savingsRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async getAllUsers(page = 1, limit = 10) {
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const [users, total] = await this.userRepository.findAndCount({
            where: { role: user_role_enum_1.UserRole.CUSTOMER },
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            order: { createdAt: 'DESC' },
        });
        return {
            data: users.map((user) => ({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                creditScore: user.creditScore,
                isActive: user.isActive,
                createdAt: user.createdAt,
            })),
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }
    async getUserDetails(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const savingsAccount = await this.savingsRepository.findOne({
            where: { userId },
        });
        return {
            ...user,
            savingsAccount,
        };
    }
    async toggleUserStatus(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = !user.isActive;
        await this.userRepository.save(user);
        this.logger.log(`User ${userId} ${user.isActive ? 'activated' : 'deactivated'}`);
        return {
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: user.id,
                email: user.email,
                isActive: user.isActive,
            },
        };
    }
    async updateCreditScore(userId, creditScore) {
        if (creditScore < 300 || creditScore > 850) {
            throw new common_1.BadRequestException('Credit score must be between 300 and 850');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.userRepository.update(userId, { creditScore });
        this.logger.log(`Credit score updated for user ${userId}: ${creditScore}`);
        return {
            message: 'Credit score updated successfully',
            userId,
            creditScore,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(savings_account_entity_1.SavingsAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map