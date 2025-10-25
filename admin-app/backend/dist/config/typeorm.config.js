"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const user_entity_1 = require("../shared/entities/user.entity");
const credit_request_entity_1 = require("../shared/entities/credit-request.entity");
const savings_account_entity_1 = require("../shared/entities/savings-account.entity");
const typeOrmConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'root'),
    database: configService.get('DB_DATABASE', 'digital_credit_client'),
    entities: [user_entity_1.User, credit_request_entity_1.CreditRequest, savings_account_entity_1.SavingsAccount],
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
});
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map