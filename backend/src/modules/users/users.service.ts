import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SavingsAccount)
    private savingsRepository: Repository<SavingsAccount>,
  ) {}

  async getAllUsers(page: number = 1, limit: number = 10) {
    // Ensure page and limit are valid numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const [users, total] = await this.userRepository.findAndCount({
      where: { role: UserRole.CUSTOMER },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
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
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
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
      throw new NotFoundException('User not found');
    }

    user.isActive = !user.isActive;
    await this.userRepository.save(user);

    this.logger.log(`User ${userId} ${user.isActive ? 'activated' : 'deactivated'}`);

    return {
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
      },
    };
  }

  async updateCreditScore(userId: string, creditScore: number) {
    if (creditScore < 300 || creditScore > 850) {
      throw new BadRequestException('Credit score must be between 300 and 850');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, { creditScore });

    this.logger.log(`Credit score updated for user ${userId}: ${creditScore}`);

    return {
      message: 'Credit score updated successfully',
      userId,
      creditScore,
    };
  }
}
