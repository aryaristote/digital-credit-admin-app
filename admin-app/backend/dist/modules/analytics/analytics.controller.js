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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const admin_guard_1 = require("../../common/guards/admin.guard");
const analytics_service_1 = require("./analytics.service");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboardStats() {
        return await this.analyticsService.getDashboardStats();
    }
    async getCreditScoreDistribution() {
        return await this.analyticsService.getCreditScoreDistribution();
    }
    async getRecentActivity(limit = 10) {
        return await this.analyticsService.getRecentActivity(limit);
    }
    async getMonthlyLoanDisbursement() {
        return await this.analyticsService.getMonthlyLoanDisbursement();
    }
    async getCreditDistributionByScore() {
        return await this.analyticsService.getCreditDistributionByScore();
    }
    async getPerformanceSummary() {
        return await this.analyticsService.getPerformanceSummary();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, swagger_1.ApiOperation)({ summary: "Get dashboard statistics" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)("credit-score-distribution"),
    (0, swagger_1.ApiOperation)({ summary: "Get credit score distribution" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCreditScoreDistribution", null);
__decorate([
    (0, common_1.Get)("recent-activity"),
    (0, swagger_1.ApiOperation)({ summary: "Get recent activity" }),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.Get)("monthly-disbursement"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly loan disbursement data" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMonthlyLoanDisbursement", null);
__decorate([
    (0, common_1.Get)("credit-distribution"),
    (0, swagger_1.ApiOperation)({ summary: "Get credit distribution by score" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCreditDistributionByScore", null);
__decorate([
    (0, common_1.Get)("performance-summary"),
    (0, swagger_1.ApiOperation)({ summary: "Get performance summary metrics" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPerformanceSummary", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)("Analytics"),
    (0, common_1.Controller)("analytics"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map