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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const auth_service_1 = require("./auth.service");
class LoginDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "admin@digitalcredit.com",
        description: "Admin email address",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Admin@123456",
        description: "Admin password",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        console.log("📥 [AUTH CONTROLLER] Received login request");
        console.log("📧 [AUTH CONTROLLER] Email:", loginDto.email);
        console.log("🔐 [AUTH CONTROLLER] Password length:", loginDto.password?.length || 0);
        try {
            const result = await this.authService.login(loginDto.email, loginDto.password);
            console.log("✅ [AUTH CONTROLLER] Login successful, sending response");
            return result;
        }
        catch (error) {
            console.error("❌ [AUTH CONTROLLER] Login failed:", error.message);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Admin login" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Login successful" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Admin Authentication"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map