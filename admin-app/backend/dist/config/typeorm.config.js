"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = exports.typeOrmConfig = void 0;
const typeorm_1 = require("typeorm");
const path_1 = require("path");
const user_entity_1 = require("../shared/entities/user.entity");
const credit_request_entity_1 = require("../shared/entities/credit-request.entity");
const savings_account_entity_1 = require("../shared/entities/savings-account.entity");
const transaction_entity_1 = require("../shared/entities/transaction.entity");
const typeOrmConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'root'),
    database: configService.get('DB_DATABASE', 'digital_credit_client'),
    entities: [user_entity_1.User, credit_request_entity_1.CreditRequest, savings_account_entity_1.SavingsAccount, transaction_entity_1.Transaction],
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
    migrations: [(0, path_1.join)(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
    migrationsTableName: 'migrations',
    migrationsRun: false,
});
exports.typeOrmConfig = typeOrmConfig;
exports.dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'digital_credit_client',
    entities: [user_entity_1.User, credit_request_entity_1.CreditRequest, savings_account_entity_1.SavingsAccount, transaction_entity_1.Transaction],
    migrations: [(0, path_1.join)(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
    migrationsTableName: 'migrations',
    migrationsRun: false,
    synchronize: false,
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=typeorm.config.js.map