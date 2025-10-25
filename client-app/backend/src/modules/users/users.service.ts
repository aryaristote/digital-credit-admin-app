import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Generate initial credit score (simulated)
    const initialCreditScore = this.generateInitialCreditScore();

    // Create user
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Update credit score
    await this.usersRepository.updateCreditScore(user.id, initialCreditScore);

    return this.toResponseDto(user);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    return this.toResponseDto(updatedUser);
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;
    await this.usersRepository.updateRefreshToken(userId, hashedRefreshToken);
  }

  async updateCreditScore(userId: string): Promise<number> {
    // Simulate credit score calculation based on user activity
    const newScore = this.calculateCreditScore();
    await this.usersRepository.updateCreditScore(userId, newScore);
    return newScore;
  }

  private toResponseDto(user: User): UserResponseDto {
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private generateInitialCreditScore(): number {
    // Simulate initial credit score (between 650-800 for better approval rate)
    return Math.floor(Math.random() * (800 - 650 + 1)) + 650;
  }

  private calculateCreditScore(): number {
    // Simulate credit score calculation (between 300-850)
    return Math.floor(Math.random() * (850 - 300 + 1)) + 300;
  }
}

