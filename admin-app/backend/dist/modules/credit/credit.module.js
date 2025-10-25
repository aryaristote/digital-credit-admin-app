"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const credit_controller_1 = require("./credit.controller");
const credit_service_1 = require("./credit.service");
const credit_request_entity_1 = require("../../shared/entities/credit-request.entity");
const user_entity_1 = require("../../shared/entities/user.entity");
let CreditModule = class CreditModule {
};
exports.CreditModule = CreditModule;
exports.CreditModule = CreditModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([credit_request_entity_1.CreditRequest, user_entity_1.User])],
        controllers: [credit_controller_1.CreditController],
        providers: [credit_service_1.CreditService],
    })
], CreditModule);
//# sourceMappingURL=credit.module.js.map