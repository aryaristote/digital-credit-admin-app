import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, deviceInfo?: any): Promise<AuthResponseDto> {
    // Validate password confirmation
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Create user
    const { confirmPassword, ...createUserDto } = registerDto;
    const userResponse = await this.usersService.create(createUserDto);

    // Get full user entity for token generation
    const user = await this.usersService.findOne(userResponse.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        parseInt(this.configService.get('JWT_REFRESH_EXPIRATION', '7')),
    );

    await this.sessionsService.createSession({
      userId: user.id,
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
      expiresAt,
      ...deviceInfo,
    });

    return {
      ...tokens,
      user: userResponse,
    };
  }

  async login(loginDto: LoginDto, deviceInfo?: any): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        parseInt(this.configService.get('JWT_REFRESH_EXPIRATION', '7')),
    );

    await this.sessionsService.createSession({
      userId: user.id,
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
      expiresAt,
      ...deviceInfo,
    });

    // Convert to response DTO
    const userResponse = await this.usersService.findOne(user.id);

    return {
      ...tokens,
      user: userResponse,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return user;
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    const session = await this.sessionsService.findByRefreshToken(
      await bcrypt.hash(refreshToken, 10),
    );

    if (!session || !session.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expiresAt < new Date()) {
      await this.sessionsService.invalidateSession(session.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.usersService.findOne(session.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const tokens = await this.generateTokens(user);

    // Update session with new refresh token
    await this.sessionsService.invalidateSession(session.id);
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        parseInt(this.configService.get('JWT_REFRESH_EXPIRATION', '7')),
    );

    await this.sessionsService.createSession({
      userId: user.id,
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
      expiresAt,
    });

    const userResponse = await this.usersService.findOne(user.id);

    return {
      ...tokens,
      user: userResponse,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const session = await this.sessionsService.findByRefreshToken(
      await bcrypt.hash(refreshToken, 10),
    );

    if (session) {
      await this.sessionsService.invalidateSession(session.id);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionsService.invalidateAllUserSessions(userId);
  }

  private async generateTokens(user: User | { id: string; email: string; role: any }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
    });

    const refreshToken = uuidv4();

    return {
      accessToken,
      refreshToken,
    };
  }
}
