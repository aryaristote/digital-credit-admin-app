import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../shared/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

async function createAdminUser() {
  // Database configuration for Docker environment
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'digital_credit_client',
    entities: [User],
    synchronize: false, // Don't auto-sync, assume tables exist
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = dataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@digitalcredit.com' },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    const adminUser = userRepository.create({
      email: 'admin@digitalcredit.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      isActive: true,
      creditScore: 0,
    });

    await userRepository.save(adminUser);

    console.log('\n🎉 Admin user created successfully!');
    console.log('=====================================');
    console.log('Email:    admin@digitalcredit.com');
    console.log('Password: Admin@123456');
    console.log('=====================================');
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await dataSource.destroy();
  }
}

createAdminUser();
