import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../modules/admins/entities/admin.entity';

async function createAdmin() {
  // Database configuration
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'digital_credit_admin',
    entities: [Admin],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const adminRepository = dataSource.getRepository(Admin);

    // Check if admin already exists
    const existingAdmin = await adminRepository.findOne({
      where: { email: 'admin@digitalcredit.com' },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      return;
    }

    // Create new admin
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
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await dataSource.destroy();
  }
}

createAdmin();

