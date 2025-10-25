import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
    return await this.userRepository.findOne({ where });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return await this.findById(id);
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.userRepository.update(id, { refreshToken });
  }

  async updateCreditScore(id: string, creditScore: number): Promise<void> {
    await this.userRepository.update(id, { creditScore });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}

