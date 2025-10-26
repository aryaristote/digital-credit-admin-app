import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditRepository } from './credit.repository';
import { UsersService } from '../users/users.service';
import { SavingsService } from '../savings/savings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCreditRequestDto } from './dto/create-credit-request.dto';
import { CreditRequest, CreditStatus } from './entities/credit-request.entity';

describe('CreditService', () => {
  let service: CreditService;
  let creditRepository: CreditRepository;
  let usersService: UsersService;
  let savingsService: SavingsService;
  let notificationsService: NotificationsService;
  let configService: ConfigService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    creditScore: 750,
    isActive: true,
  };

  const mockCreditRequest = {
    id: 'credit-123',
    userId: 'user-123',
    requestedAmount: 5000,
    termMonths: 6,
    status: CreditStatus.PENDING,
    interestRate: 7.5,
    createdAt: new Date(),
  };

  const mockCreditRepository = {
    createCreditRequest: jest.fn(),
    findActiveByUserId: jest.fn(),
    findById: jest.fn(),
    findUserCreditRequests: jest.fn(),
    save: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  const mockSavingsService = {
    getAccount: jest.fn(),
    withdraw: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditService,
        {
          provide: CreditRepository,
          useValue: mockCreditRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: SavingsService,
          useValue: mockSavingsService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CreditService>(CreditService);
    creditRepository = module.get<CreditRepository>(CreditRepository);
    usersService = module.get<UsersService>(UsersService);
    savingsService = module.get<SavingsService>(SavingsService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  describe('createCreditRequest', () => {
    const createDto: CreateCreditRequestDto = {
      requestedAmount: 5000,
      termMonths: 6,
    };

    it('should create credit request successfully', async () => {
      // Arrange
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockCreditRepository.findActiveByUserId.mockResolvedValue([]);
      mockCreditRepository.createCreditRequest.mockResolvedValue(mockCreditRequest);

      // Act
      const result = await service.createCreditRequest('user-123', createDto);

      // Assert
      expect(result).toBeDefined();
      expect(usersService.findById).toHaveBeenCalledWith('user-123');
      expect(creditRepository.findActiveByUserId).toHaveBeenCalledWith('user-123');
      expect(creditRepository.createCreditRequest).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      mockUsersService.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.createCreditRequest('user-123', createDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(creditRepository.createCreditRequest).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user has active credit request', async () => {
      // Arrange
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockCreditRepository.findActiveByUserId.mockResolvedValue([mockCreditRequest]);

      // Act & Assert
      await expect(service.createCreditRequest('user-123', createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(creditRepository.createCreditRequest).not.toHaveBeenCalled();
    });

    it('should calculate correct interest rate based on credit score', async () => {
      // Arrange
      const highScoreUser = { ...mockUser, creditScore: 800 };
      mockUsersService.findById.mockResolvedValue(highScoreUser);
      mockCreditRepository.findActiveByUserId.mockResolvedValue([]);
      mockCreditRepository.createCreditRequest.mockResolvedValue({
        ...mockCreditRequest,
        interestRate: 5.0,
      });

      // Act
      await service.createCreditRequest('user-123', createDto);

      // Assert
      expect(creditRepository.createCreditRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          interestRate: expect.any(Number),
        }),
      );
    });
  });

  describe('calculateInterestRate', () => {
    it('should return 5.0 for credit score >= 800', () => {
      const rate = (service as any).calculateInterestRate(800);
      expect(rate).toBe(5.0);
    });

    it('should return 7.5 for credit score >= 700', () => {
      const rate = (service as any).calculateInterestRate(750);
      expect(rate).toBe(7.5);
    });

    it('should return 10.0 for credit score >= 600', () => {
      const rate = (service as any).calculateInterestRate(650);
      expect(rate).toBe(10.0);
    });

    it('should return 15.0 for credit score < 600', () => {
      const rate = (service as any).calculateInterestRate(550);
      expect(rate).toBe(15.0);
    });
  });
});
