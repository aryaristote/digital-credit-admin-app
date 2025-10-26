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
exports.CreditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const admin_guard_1 = require("../../common/guards/admin.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const credit_service_1 = require("./credit.service");
let CreditController = class CreditController {
    constructor(creditService) {
        this.creditService = creditService;
    }
    async getPendingRequests(page = 1, limit = 10) {
        return await this.creditService.getPendingRequests(page, limit);
    }
    async getAllRequests(page = 1, limit = 10, status) {
        console.log('📥 [CREDIT CONTROLLER] Fetching credit requests - status:', status || 'all');
        const result = await this.creditService.getAllRequests(page, limit, status);
        console.log('✅ [CREDIT CONTROLLER] Found', result.total, 'credit requests');
        return result;
    }
    async getStats() {
        return await this.creditService.getCreditStats();
    }
    async approveRequest(requestId, adminId, approvedAmount) {
        return await this.creditService.approveRequest(requestId, adminId, approvedAmount);
    }
    async rejectRequest(requestId, adminId, reason) {
        return await this.creditService.rejectRequest(requestId, adminId, reason);
    }
    async bulkApprove(adminId, body) {
        return await this.creditService.bulkApproveRequests(body.requestIds, adminId, body.approvedAmounts);
    }
    async bulkReject(adminId, body) {
        return await this.creditService.bulkRejectRequests(body.requestIds, adminId, body.reason);
    }
    async searchCredits(status, minAmount, maxAmount, minCreditScore, maxCreditScore, dateFrom, dateTo, page = 1, limit = 10) {
        return await this.creditService.searchCredits({
            status,
            minAmount,
            maxAmount,
            minCreditScore,
            maxCreditScore,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
            page,
            limit,
        });
    }
};
exports.CreditController = CreditController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending credit requests' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all credit requests' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getAllRequests", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get credit statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "getStats", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve credit request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)('approvedAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject credit request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "rejectRequest", null);
__decorate([
    (0, common_1.Put)('bulk/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk approve credit requests' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "bulkApprove", null);
__decorate([
    (0, common_1.Put)('bulk/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk reject credit requests' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "bulkReject", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Advanced search for credit requests' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('minAmount')),
    __param(2, (0, common_1.Query)('maxAmount')),
    __param(3, (0, common_1.Query)('minCreditScore')),
    __param(4, (0, common_1.Query)('maxCreditScore')),
    __param(5, (0, common_1.Query)('dateFrom')),
    __param(6, (0, common_1.Query)('dateTo')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CreditController.prototype, "searchCredits", null);
exports.CreditController = CreditController = __decorate([
    (0, swagger_1.ApiTags)('Credit Management'),
    (0, common_1.Controller)('credit'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [credit_service_1.CreditService])
], CreditController);
//# sourceMappingURL=credit.controller.js.map