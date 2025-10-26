import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../shared/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    this.logger.log(`Login attempt for: ${email}`);

    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        this.logger.warn(`Login failed: User not found - ${email}`);
        throw new UnauthorizedException('Invalid credentials or not an admin');
      }

      if (user.role !== UserRole.ADMIN) {
        this.logger.warn(`Login failed: User is not an admin - ${email}`);
        throw new UnauthorizedException('Invalid credentials or not an admin');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.warn(`Login failed: Invalid password - ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        this.logger.warn(`Login failed: Account deactivated - ${email}`);
        throw new UnauthorizedException('Account is deactivated');
      }

      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      this.logger.log(`Login successful for: ${email}`);
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
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login error: ${error.message}`, error.stack);
      throw new UnauthorizedException('Authentication failed');
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
