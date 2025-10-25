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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const admin_guard_1 = require("../../common/guards/admin.guard");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getUsers(page = 1, limit = 10) {
        console.log("📥 [USERS CONTROLLER] Fetching users - page:", page, "limit:", limit);
        const result = await this.usersService.getAllUsers(page, limit);
        console.log("✅ [USERS CONTROLLER] Found", result.total, "total users,", result.data.length, "in this page");
        return result;
    }
    async getUserDetails(userId) {
        return await this.usersService.getUserDetails(userId);
    }
    async toggleStatus(userId) {
        return await this.usersService.toggleUserStatus(userId);
    }
    async updateCreditScore(userId, creditScore) {
        return await this.usersService.updateCreditScore(userId, creditScore);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all users with pagination" }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get user details" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Put)(":id/toggle-status"),
    (0, swagger_1.ApiOperation)({ summary: "Activate or deactivate user" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Put)(":id/credit-score"),
    (0, swagger_1.ApiOperation)({ summary: "Update user credit score" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("creditScore")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCreditScore", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)("User Management"),
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map