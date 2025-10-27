import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../shared/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

export async function seedAdmins(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@example.com' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping...');
    return;
  }

  const admin = userRepository.create({
    email: 'admin@example.com',
    password: await bcrypt.hash('Admin123!', 10),
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    isActive: true,
    creditScore: 0, // Admins don't need credit scores
  });

  await userRepository.save(admin);
  console.log('✅ Seeded admin user: admin@example.com / Admin123!');
}
