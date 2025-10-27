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
    this.logger.log(`🔄 Login attempt for: ${email}`);

    try {
      // Step 1: Find user
      this.logger.log(`🔍 Searching for user with email: ${email}`);
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        this.logger.warn(`❌ Login failed: User not found - ${email}`);
        throw new UnauthorizedException('Invalid credentials or not an admin');
      }

      this.logger.log(
        `✅ User found: ${user.id}, Role: ${user.role}, Active: ${user.isActive}`,
      );

      // Step 2: Check if admin
      if (user.role !== UserRole.ADMIN) {
        this.logger.warn(
          `❌ Login failed: User is not an admin - ${email}, Role: ${user.role}`,
        );
        throw new UnauthorizedException('Invalid credentials or not an admin');
      }

      // Step 3: Validate password
      this.logger.log(`🔐 Validating password for user: ${email}`);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.warn(`❌ Login failed: Invalid password - ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`✅ Password validated successfully for: ${email}`);

      // Step 4: Check if active
      if (!user.isActive) {
        this.logger.warn(`❌ Login failed: Account deactivated - ${email}`);
        throw new UnauthorizedException('Account is deactivated');
      }

      // Step 5: Generate token
      this.logger.log(`🎫 Generating JWT token for: ${email}`);
      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      this.logger.log(`✅ Login successful for: ${email}`);
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
        this.logger.error(`🚫 Unauthorized: ${error.message}`);
        throw error;
      }
      this.logger.error(`💥 Login error: ${error.message}`, error.stack);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async validateUser(userId: string): Promise<User> {
    this.logger.log(`🔍 Validating user with ID: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      this.logger.warn(`❌ User not found: ${userId}`);
      throw new UnauthorizedException('User not found');
    }

    if (user.role !== UserRole.ADMIN) {
      this.logger.warn(`❌ User is not admin: ${userId}, Role: ${user.role}`);
      throw new UnauthorizedException('User is not an admin');
    }

    if (!user.isActive) {
      this.logger.warn(`❌ User is not active: ${userId}`);
      throw new UnauthorizedException('User is deactivated');
    }

    this.logger.log(`✅ User validated successfully: ${userId}`);
    return user;
  }
}
