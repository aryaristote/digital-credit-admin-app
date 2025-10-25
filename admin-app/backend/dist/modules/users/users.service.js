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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../shared/entities/user.entity");
const savings_account_entity_1 = require("../../shared/entities/savings-account.entity");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let UsersService = class UsersService {
    constructor(userRepository, savingsRepository) {
        this.userRepository = userRepository;
        this.savingsRepository = savingsRepository;
    }
    async getAllUsers(page = 1, limit = 10) {
        const [users, total] = await this.userRepository.findAndCount({
            where: { role: user_role_enum_1.UserRole.CUSTOMER },
            skip: (page - 1) * limit,
            take: limit,
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
            page,
            totalPages: Math.ceil(total / limit),
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
            throw new Error('User not found');
        }
        user.isActive = !user.isActive;
        await this.userRepository.save(user);
        return { message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` };
    }
    async updateCreditScore(userId, creditScore) {
        await this.userRepository.update(userId, { creditScore });
        return { message: 'Credit score updated successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(savings_account_entity_1.SavingsAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map