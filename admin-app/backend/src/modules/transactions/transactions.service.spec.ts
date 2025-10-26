import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionStatus } from '../../shared/entities/transaction.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';
import { User } from '../../shared/entities/user.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockTransactionRepository = {
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
  };

  const mockSavingsAccountRepository = {};
  const mockUserRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(SavingsAccount),
          useValue: mockSavingsAccountRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTransactions', () => {
    it('should return paginated transactions', async () => {
      // Arrange
      const mockTransactions = [
        {
          id: 'txn-1',
          type: 'deposit',
          amount: 1000,
          balanceAfter: 1000,
          status: TransactionStatus.COMPLETED,
          createdAt: new Date(),
          savingsAccount: {
            user: {
              id: 'user-1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
            },
          },
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockTransactions, 1]),
      };

      mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // Act
      const result = await service.getAllTransactions(1, 50);

      // Assert
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('totalPages');
      expect(result.data).toHaveLength(1);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(50);
    });

    it('should filter by transaction type when provided', async () => {
      // Arrange
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // Act
      await service.getAllTransactions(1, 50, 'deposit');

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('transaction.type = :type', {
        type: 'deposit',
      });
    });

    it('should handle invalid page and limit values', async () => {
      // Arrange
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // Act
      await service.getAllTransactions(NaN, NaN);

      // Assert
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(50);
    });
  });

  describe('getTransactionStats', () => {
    it('should return transaction statistics', async () => {
      // Arrange
      const mockDepositQuery = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '5000' }),
      };

      const mockWithdrawalQuery = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '2000' }),
      };

      mockTransactionRepository.createQueryBuilder
        .mockReturnValueOnce(mockDepositQuery)
        .mockReturnValueOnce(mockWithdrawalQuery);

      mockTransactionRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(10) // pending
        .mockResolvedValueOnce(85) // completed
        .mockResolvedValueOnce(5); // failed

      // Act
      const result = await service.getTransactionStats();

      // Assert
      expect(result).toHaveProperty('totalDeposits');
      expect(result).toHaveProperty('totalWithdrawals');
      expect(result).toHaveProperty('totalCount');
      expect(result).toHaveProperty('pendingCount');
      expect(result).toHaveProperty('completedCount');
      expect(result).toHaveProperty('failedCount');
      expect(result.totalDeposits).toBe(5000);
      expect(result.totalWithdrawals).toBe(2000);
      expect(result.totalCount).toBe(100);
    });

    it('should handle null totals gracefully', async () => {
      // Arrange
      const mockDepositQuery = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: null }),
      };

      const mockWithdrawalQuery = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: null }),
      };

      mockTransactionRepository.createQueryBuilder
        .mockReturnValueOnce(mockDepositQuery)
        .mockReturnValueOnce(mockWithdrawalQuery);

      mockTransactionRepository.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      // Act
      const result = await service.getTransactionStats();

      // Assert
      expect(result.totalDeposits).toBe(0);
      expect(result.totalWithdrawals).toBe(0);
    });
  });
});
