import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let sessionsService: SessionsService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    isActive: true,
    creditScore: 700,
  };

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
  };

  const mockSessionsService = {
    createSession: jest.fn(),
    findByRefreshToken: jest.fn(),
    invalidateSession: jest.fn(),
    invalidateAllUserSessions: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    sessionsService = module.get<SessionsService>(SessionsService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'StrongP@ssw0rd',
        confirmPassword: 'StrongP@ssw0rd',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const createdUser = { id: '456', ...mockUser, email: registerDto.email };

      mockUsersService.create.mockResolvedValue(createdUser);
      mockUsersService.findOne.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue('mock-access-token');
      mockConfigService.get.mockReturnValue('15m');
      mockSessionsService.createSession.mockResolvedValue({});

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');

      const result = await authService.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw error if passwords do not match', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'StrongP@ssw0rd',
        confirmPassword: 'DifferentP@ssw0rd',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'StrongP@ssw0rd',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');
      mockJwtService.sign.mockReturnValue('mock-access-token');
      mockConfigService.get.mockReturnValue('15m');
      mockSessionsService.createSession.mockResolvedValue({});

      const result = await authService.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
    });

    it('should throw error for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user for valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'StrongP@ssw0rd',
      );

      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'test@example.com',
        'WrongPassword',
      );

      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistent@example.com',
        'password',
      );

      expect(result).toBeNull();
    });

    it('should throw error for inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockUsersService.findByEmail.mockResolvedValue(inactiveUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.validateUser('test@example.com', 'StrongP@ssw0rd'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

