import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SavingsAccount)
    private savingsRepository: Repository<SavingsAccount>,
  ) {}

  async getAllUsers(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      where: { role: UserRole.CUSTOMER },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        creditScore: user.creditScore,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetails(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const savingsAccount = await this.savingsRepository.findOne({
      where: { userId },
    });

    return {
      ...user,
      savingsAccount,
    };
  }

  async toggleUserStatus(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    await this.userRepository.save(user);

    return { message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` };
  }

  async updateCreditScore(userId: string, creditScore: number) {
    await this.userRepository.update(userId, { creditScore });
    return { message: 'Credit score updated successfully' };
  }
}

