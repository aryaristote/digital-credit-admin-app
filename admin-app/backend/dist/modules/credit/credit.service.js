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
var CreditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_request_entity_1 = require("../../shared/entities/credit-request.entity");
const user_entity_1 = require("../../shared/entities/user.entity");
let CreditService = CreditService_1 = class CreditService {
    constructor(creditRequestRepository, userRepository) {
        this.creditRequestRepository = creditRequestRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(CreditService_1.name);
    }
    async getPendingRequests(page = 1, limit = 10) {
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const [requests, total] = await this.creditRequestRepository.findAndCount({
            where: { status: credit_request_entity_1.CreditStatus.PENDING },
            relations: ['user'],
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            order: { createdAt: 'ASC' },
        });
        return {
            data: requests.map((req) => ({
                id: req.id,
                userId: req.user.id,
                user: {
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    creditScore: req.user.creditScore,
                },
                requestedAmount: Number(req.requestedAmount),
                approvedAmount: req.approvedAmount ? Number(req.approvedAmount) : 0,
                interestRate: Number(req.interestRate),
                termMonths: req.termMonths,
                status: req.status,
                purpose: req.purpose,
                rejectionReason: req.rejectionReason,
                createdAt: req.createdAt,
            })),
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }
    async getAllRequests(page = 1, limit = 10, status) {
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const where = {};
        if (status) {
            where.status = status;
        }
        const [requests, total] = await this.creditRequestRepository.findAndCount({
            where,
            relations: ['user'],
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            order: { createdAt: 'DESC' },
        });
        return {
            data: requests.map((req) => ({
                id: req.id,
                userId: req.user.id,
                user: {
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    creditScore: req.user.creditScore,
                },
                requestedAmount: Number(req.requestedAmount),
                approvedAmount: req.approvedAmount ? Number(req.approvedAmount) : 0,
                interestRate: Number(req.interestRate),
                termMonths: req.termMonths,
                status: req.status,
                purpose: req.purpose,
                rejectionReason: req.rejectionReason,
                createdAt: req.createdAt,
            })),
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }
    async approveRequest(requestId, adminId, approvedAmount) {
        this.logger.log(`Processing approval for request ${requestId} by admin ${adminId}`);
        const request = await this.creditRequestRepository.findOne({
            where: { id: requestId },
            relations: ['user'],
        });
        if (!request) {
            this.logger.warn(`Credit request not found: ${requestId}`);
            throw new common_1.NotFoundException('Credit request not found');
        }
        if (request.status !== credit_request_entity_1.CreditStatus.PENDING) {
            this.logger.warn(`Cannot approve request ${requestId} with status: ${request.status}`);
            throw new common_1.BadRequestException(`Cannot approve request with status: ${request.status}. Only pending requests can be approved.`);
        }
        const finalAmount = approvedAmount || request.requestedAmount;
        if (finalAmount <= 0) {
            throw new common_1.BadRequestException('Approved amount must be greater than 0');
        }
        if (approvedAmount && approvedAmount > request.requestedAmount) {
            throw new common_1.BadRequestException('Approved amount cannot exceed requested amount');
        }
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + request.termMonths);
        request.status = credit_request_entity_1.CreditStatus.ACTIVE;
        request.approvedAmount = finalAmount;
        request.approvedBy = adminId;
        request.approvedAt = new Date();
        request.dueDate = dueDate;
        await this.creditRequestRepository.save(request);
        this.logger.log(`Credit request ${requestId} approved: ${finalAmount} at ${request.interestRate}% interest`);
        return {
            message: 'Credit request approved successfully',
            request: {
                id: request.id,
                status: request.status,
                approvedAmount: request.approvedAmount,
                approvedBy: request.approvedBy,
                approvedAt: request.approvedAt,
                dueDate: request.dueDate,
            },
        };
    }
    async rejectRequest(requestId, adminId, reason) {
        this.logger.log(`Processing rejection for request ${requestId} by admin ${adminId}`);
        if (!reason || reason.trim().length === 0) {
            throw new common_1.BadRequestException('Rejection reason is required');
        }
        const request = await this.creditRequestRepository.findOne({
            where: { id: requestId },
            relations: ['user'],
        });
        if (!request) {
            this.logger.warn(`Credit request not found: ${requestId}`);
            throw new common_1.NotFoundException('Credit request not found');
        }
        if (request.status !== credit_request_entity_1.CreditStatus.PENDING) {
            this.logger.warn(`Cannot reject request ${requestId} with status: ${request.status}`);
            throw new common_1.BadRequestException(`Cannot reject request with status: ${request.status}. Only pending requests can be rejected.`);
        }
        request.status = credit_request_entity_1.CreditStatus.REJECTED;
        request.rejectionReason = reason.trim();
        request.approvedBy = adminId;
        request.approvedAt = new Date();
        await this.creditRequestRepository.save(request);
        this.logger.log(`Credit request ${requestId} rejected by admin ${adminId}`);
        return {
            message: 'Credit request rejected',
            request: {
                id: request.id,
                status: request.status,
                rejectionReason: request.rejectionReason,
                rejectedBy: request.approvedBy,
                rejectedAt: request.approvedAt,
            },
        };
    }
    async getCreditStats() {
        const [total, pending, approved, rejected, active, completed] = await Promise.all([
            this.creditRequestRepository.count(),
            this.creditRequestRepository.count({
                where: { status: credit_request_entity_1.CreditStatus.PENDING },
            }),
            this.creditRequestRepository.count({
                where: { status: credit_request_entity_1.CreditStatus.APPROVED },
            }),
            this.creditRequestRepository.count({
                where: { status: credit_request_entity_1.CreditStatus.REJECTED },
            }),
            this.creditRequestRepository.count({
                where: { status: credit_request_entity_1.CreditStatus.ACTIVE },
            }),
            this.creditRequestRepository.count({
                where: { status: credit_request_entity_1.CreditStatus.COMPLETED },
            }),
        ]);
        const totalAmountResult = await this.creditRequestRepository
            .createQueryBuilder('credit')
            .select('SUM(credit.approvedAmount)', 'total')
            .where('credit.status IN (:...statuses)', {
            statuses: [credit_request_entity_1.CreditStatus.ACTIVE, credit_request_entity_1.CreditStatus.COMPLETED],
        })
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
    async bulkApproveRequests(requestIds, adminId, approvedAmounts) {
        this.logger.log(`Bulk approving ${requestIds.length} credit requests`);
        const results = {
            successful: [],
            failed: [],
        };
        for (const requestId of requestIds) {
            try {
                const approvedAmount = approvedAmounts?.[requestId];
                const result = await this.approveRequest(requestId, adminId, approvedAmount);
                results.successful.push({
                    requestId,
                    ...result.request,
                });
            }
            catch (error) {
                this.logger.error(`Failed to approve request ${requestId}: ${error.message}`);
                results.failed.push({
                    requestId,
                    error: error.message,
                });
            }
        }
        this.logger.log(`Bulk approval completed: ${results.successful.length} succeeded, ${results.failed.length} failed`);
        return {
            message: `Bulk approval completed: ${results.successful.length} succeeded, ${results.failed.length} failed`,
            successful: results.successful,
            failed: results.failed,
        };
    }
    async bulkRejectRequests(requestIds, adminId, reason) {
        this.logger.log(`Bulk rejecting ${requestIds.length} credit requests`);
        const results = {
            successful: [],
            failed: [],
        };
        for (const requestId of requestIds) {
            try {
                const result = await this.rejectRequest(requestId, adminId, reason);
                results.successful.push({
                    requestId,
                    ...result.request,
                });
            }
            catch (error) {
                this.logger.error(`Failed to reject request ${requestId}: ${error.message}`);
                results.failed.push({
                    requestId,
                    error: error.message,
                });
            }
        }
        this.logger.log(`Bulk rejection completed: ${results.successful.length} succeeded, ${results.failed.length} failed`);
        return {
            message: `Bulk rejection completed: ${results.successful.length} succeeded, ${results.failed.length} failed`,
            successful: results.successful,
            failed: results.failed,
        };
    }
    async searchCredits(filters) {
        const { status, minAmount, maxAmount, minCreditScore, maxCreditScore, dateFrom, dateTo, page = 1, limit = 10, } = filters;
        const queryBuilder = this.creditRequestRepository
            .createQueryBuilder('credit')
            .leftJoinAndSelect('credit.user', 'user')
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('credit.createdAt', 'DESC');
        if (status) {
            queryBuilder.andWhere('credit.status = :status', { status });
        }
        if (minAmount !== undefined) {
            queryBuilder.andWhere('credit.requestedAmount >= :minAmount', { minAmount });
        }
        if (maxAmount !== undefined) {
            queryBuilder.andWhere('credit.requestedAmount <= :maxAmount', { maxAmount });
        }
        if (minCreditScore !== undefined) {
            queryBuilder.andWhere('user.creditScore >= :minCreditScore', { minCreditScore });
        }
        if (maxCreditScore !== undefined) {
            queryBuilder.andWhere('user.creditScore <= :maxCreditScore', { maxCreditScore });
        }
        if (dateFrom) {
            queryBuilder.andWhere('credit.createdAt >= :dateFrom', { dateFrom });
        }
        if (dateTo) {
            queryBuilder.andWhere('credit.createdAt <= :dateTo', { dateTo });
        }
        const [requests, total] = await queryBuilder.getManyAndCount();
        return {
            data: requests.map((req) => ({
                id: req.id,
                userId: req.user.id,
                user: {
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    creditScore: req.user.creditScore,
                },
                requestedAmount: Number(req.requestedAmount),
                approvedAmount: req.approvedAmount ? Number(req.approvedAmount) : 0,
                interestRate: Number(req.interestRate),
                termMonths: req.termMonths,
                status: req.status,
                purpose: req.purpose,
                rejectionReason: req.rejectionReason,
                createdAt: req.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
};
exports.CreditService = CreditService;
exports.CreditService = CreditService = CreditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_request_entity_1.CreditRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CreditService);
//# sourceMappingURL=credit.service.js.map