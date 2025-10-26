import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cacheService: CacheService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
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

    // Invalidate user list cache
    await this.cacheService.del('users:list');

    return this.toResponseDto(user);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    // Try cache first
    const cacheKey = this.cacheService.generateKey('user', id);
    const cached = await this.cacheService.get<UserResponseDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const response = this.toResponseDto(user);

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, response, 300);

    return response;
  }

  async findByEmail(email: string): Promise<User | null> {
    // Cache email lookups
    const cacheKey = this.cacheService.generateKey('user:email', email);
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.usersRepository.findByEmail(email),
      300, // 5 minutes
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.update(id, updateUserDto);

    // Invalidate caches
    await this.cacheService.del(this.cacheService.generateKey('user', id));
    await this.cacheService.del('users:list');

    return this.toResponseDto(user);
  }

  private generateInitialCreditScore(): number {
    // Simulate credit score generation
    return Math.floor(Math.random() * 200) + 600; // 600-800
  }

  private toResponseDto(user: User): UserResponseDto {
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
