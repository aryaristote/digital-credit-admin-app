"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const admin_entity_1 = require("../modules/admins/entities/admin.entity");
async function createAdmin() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_DATABASE || 'digital_credit_admin',
        entities: [admin_entity_1.Admin],
        synchronize: true,
    });
    try {
        await dataSource.initialize();
        console.log('✅ Database connected');
        const adminRepository = dataSource.getRepository(admin_entity_1.Admin);
        const existingAdmin = await adminRepository.findOne({
            where: { email: 'admin@digitalcredit.com' },
        });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            return;
        }
        const hashedPassword = await bcrypt.hash('Admin@123456', 10);
        const admin = adminRepository.create({
            email: 'admin@digitalcredit.com',
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'admin',
            isActive: true,
        });
        await adminRepository.save(admin);
        console.log('\n🎉 Admin user created successfully!');
        console.log('=====================================');
        console.log('Email:    admin@digitalcredit.com');
        console.log('Password: Admin@123456');
        console.log('=====================================');
        console.log('\n⚠️  Please change the password after first login!');
    }
    catch (error) {
        console.error('❌ Error creating admin:', error.message);
    }
    finally {
        await dataSource.destroy();
    }
}
createAdmin();
//# sourceMappingURL=create-admin.js.map