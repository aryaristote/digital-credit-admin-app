import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../shared/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    console.log('🔐 [AUTH SERVICE] Login attempt for:', email);
    
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      console.log('👤 [AUTH SERVICE] User found:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('❌ [AUTH SERVICE] User not found');
        throw new UnauthorizedException('Invalid credentials or not an admin');
      }

      console.log('🔍 [AUTH SERVICE] User role:', user.role);
      if (user.role !== UserRole.ADMIN) {
        console.log('❌ [AUTH SERVICE] User is not an admin');
        throw new UnauthorizedException('Invalid credentials or not an admin');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('🔑 [AUTH SERVICE] Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ [AUTH SERVICE] Invalid password');
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('✅ [AUTH SERVICE] User active:', user.isActive);
      if (!user.isActive) {
        console.log('❌ [AUTH SERVICE] Account is deactivated');
        throw new UnauthorizedException('Account is deactivated');
      }

      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      console.log('🎉 [AUTH SERVICE] Login successful for:', email);
      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('💥 [AUTH SERVICE] Login error:', error.message);
      throw error;
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user || user.role !== UserRole.ADMIN || !user.isActive) {
      throw new UnauthorizedException('Invalid user or not an admin');
    }

    return user;
  }
}

