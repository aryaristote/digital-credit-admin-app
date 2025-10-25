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
exports.CreditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_request_entity_1 = require("../../shared/entities/credit-request.entity");
const user_entity_1 = require("../../shared/entities/user.entity");
let CreditService = class CreditService {
    constructor(creditRequestRepository, userRepository) {
        this.creditRequestRepository = creditRequestRepository;
        this.userRepository = userRepository;
    }
    async getPendingRequests(page = 1, limit = 10) {
        const [requests, total] = await this.creditRequestRepository.findAndCount({
            where: { status: credit_request_entity_1.CreditStatus.PENDING },
            relations: ['user'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'ASC' },
        });
        return {
            data: requests.map((req) => ({
                id: req.id,
                user: {
                    id: req.user.id,
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    email: req.user.email,
                    creditScore: req.user.creditScore,
                },
                requestedAmount: req.requestedAmount,
                termMonths: req.termMonths,
                purpose: req.purpose,
                interestRate: req.interestRate,
                createdAt: req.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getAllRequests(page = 1, limit = 10, status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        const [requests, total] = await this.creditRequestRepository.findAndCount({
            where,
            relations: ['user'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: requests,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async approveRequest(requestId, adminId, approvedAmount) {
        const request = await this.creditRequestRepository.findOne({
            where: { id: requestId },
        });
        if (!request) {
            throw new Error('Credit request not found');
        }
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + request.termMonths);
        request.status = credit_request_entity_1.CreditStatus.ACTIVE;
        request.approvedAmount = approvedAmount || request.requestedAmount;
        request.approvedBy = adminId;
        request.approvedAt = new Date();
        request.dueDate = dueDate;
        await this.creditRequestRepository.save(request);
        return { message: 'Credit request approved successfully', request };
    }
    async rejectRequest(requestId, adminId, reason) {
        const request = await this.creditRequestRepository.findOne({
            where: { id: requestId },
        });
        if (!request) {
            throw new Error('Credit request not found');
        }
        request.status = credit_request_entity_1.CreditStatus.REJECTED;
        request.rejectionReason = reason;
        request.approvedBy = adminId;
        await this.creditRequestRepository.save(request);
        return { message: 'Credit request rejected', request };
    }
    async getCreditStats() {
        const [total, pending, approved, rejected, active, completed] = await Promise.all([
            this.creditRequestRepository.count(),
            this.creditRequestRepository.count({ where: { status: credit_request_entity_1.CreditStatus.PENDING } }),
            this.creditRequestRepository.count({ where: { status: credit_request_entity_1.CreditStatus.APPROVED } }),
            this.creditRequestRepository.count({ where: { status: credit_request_entity_1.CreditStatus.REJECTED } }),
            this.creditRequestRepository.count({ where: { status: credit_request_entity_1.CreditStatus.ACTIVE } }),
            this.creditRequestRepository.count({ where: { status: credit_request_entity_1.CreditStatus.COMPLETED } }),
        ]);
        const totalAmountResult = await this.creditRequestRepository
            .createQueryBuilder('credit')
            .select('SUM(credit.approvedAmount)', 'total')
            .where('credit.status IN (:...statuses)', { statuses: [credit_request_entity_1.CreditStatus.ACTIVE, credit_request_entity_1.CreditStatus.COMPLETED] })
            .getRawOne();
        return {
            total,
            pending,
            approved,
            rejected,
            active,
            completed,
            totalDisbursed: parseFloat(totalAmountResult?.total || '0'),
        };
    }
};
exports.CreditService = CreditService;
exports.CreditService = CreditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_request_entity_1.CreditRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CreditService);
//# sourceMappingURL=credit.service.js.map