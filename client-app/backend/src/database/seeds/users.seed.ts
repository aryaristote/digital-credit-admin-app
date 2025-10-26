import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Users already seeded, skipping...');
    return;
  }

  const users = [
    {
      email: 'john.doe@example.com',
      password: await bcrypt.hash('Password123!', 10),
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      dateOfBirth: new Date('1990-01-15'),
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      postalCode: '10001',
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      isActive: true,
      creditScore: 750,
    },
    {
      email: 'jane.smith@example.com',
      password: await bcrypt.hash('Password123!', 10),
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '+1234567891',
      dateOfBirth: new Date('1985-05-20'),
      address: '456 Oak Ave',
      city: 'Los Angeles',
      country: 'USA',
      postalCode: '90001',
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      isActive: true,
      creditScore: 680,
    },
    {
      email: 'test.user@example.com',
      password: await bcrypt.hash('Password123!', 10),
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '+1234567892',
      role: UserRole.CUSTOMER,
      isEmailVerified: false,
      isActive: true,
      creditScore: 720,
    },
  ];

  await userRepository.save(users);
  console.log(`✅ Seeded ${users.length} users`);
}
