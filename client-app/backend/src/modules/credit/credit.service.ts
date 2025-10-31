import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { CreditRepository } from './credit.repository';
import { UsersService } from '../users/users.service';
import { SavingsService } from '../savings/savings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCreditRequestDto } from './dto/create-credit-request.dto';
import { RepayCreditDto } from './dto/repay-credit.dto';
import { CreditRequestResponseDto } from './dto/credit-request-response.dto';
import { CreditRepaymentResponseDto } from './dto/credit-repayment-response.dto';
import { CreditRequest, CreditStatus } from './entities/credit-request.entity';
import { CreditRepayment } from './entities/credit-repayment.entity';

@Injectable()
export class CreditService {
  constructor(
    private readonly creditRepository: CreditRepository,
    private readonly usersService: UsersService,
    private readonly savingsService: SavingsService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  async createCreditRequest(
    userId: string,
    createCreditRequestDto: CreateCreditRequestDto,
  ): Promise<CreditRequestResponseDto> {
    // Check if user has active credit requests
    const activeCredits = await this.creditRepository.findActiveByUserId(userId);
    if (activeCredits.length > 0) {
      throw new BadRequestException('User already has an active credit request');
    }

    // Get user to check credit score
    const user = await this.usersService.findOne(userId);

    // Calculate interest rate based on credit score
    const interestRate = this.calculateInterestRate(user.creditScore || 0);

    // Determine approval status based on credit score
    const minCreditScore = this.configService.get('MIN_CREDIT_SCORE', 600);
    const shouldAutoApprove = (user.creditScore || 0) >= 750;
    const shouldApprove = (user.creditScore || 0) >= minCreditScore;

    let status: CreditStatus;
    let approvedAmount = 0;
    let rejectionReason: string | null = null;

    if (shouldAutoApprove) {
      status = CreditStatus.ACTIVE;
      approvedAmount = createCreditRequestDto.requestedAmount;
    } else if (shouldApprove) {
      status = CreditStatus.PENDING;
      approvedAmount = createCreditRequestDto.requestedAmount;
    } else {
      status = CreditStatus.REJECTED;
      rejectionReason = 'Credit score below minimum requirement';
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + createCreditRequestDto.termMonths);

    // Create credit request
    const creditRequest = await this.creditRepository.createCreditRequest({
      userId,
      requestedAmount: createCreditRequestDto.requestedAmount,
      approvedAmount,
      totalRepaid: 0,
      interestRate,
      termMonths: createCreditRequestDto.termMonths,
      status,
      purpose: createCreditRequestDto.purpose || 'Personal loan',
      rejectionReason,
      approvedAt: status === CreditStatus.ACTIVE ? new Date() : null,
      dueDate,
    });

    // Send notification
    if (status === CreditStatus.ACTIVE) {
      await this.notificationsService.createNotification(
        userId,
        'Credit Request Approved',
        `Your credit request of $${approvedAmount} has been approved.`,
        'credit_approved' as any,
      );
    } else if (status === CreditStatus.REJECTED) {
      await this.notificationsService.createNotification(
        userId,
        'Credit Request Rejected',
        `Your credit request has been rejected: ${rejectionReason}`,
        'credit_rejected' as any,
      );
    }

    return this.toCreditRequestResponseDto(creditRequest);
  }

  async getCreditRequests(userId: string): Promise<CreditRequestResponseDto[]> {
    const credits = await this.creditRepository.findByUserId(userId);
    return credits.map((credit) => this.toCreditRequestResponseDto(credit));
  }

  async getCreditRequest(
    userId: string,
    creditRequestId: string,
  ): Promise<CreditRequestResponseDto> {
    const creditRequest = await this.creditRepository.findById(creditRequestId);

    if (!creditRequest) {
      throw new NotFoundException('Credit request not found');
    }

    if (creditRequest.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    return this.toCreditRequestResponseDto(creditRequest);
  }

  async repayCredit(
    userId: string,
    creditRequestId: string,
    repayCreditDto: RepayCreditDto,
  ): Promise<CreditRepaymentResponseDto> {
    // Verify credit request exists and belongs to user
    const creditRequest = await this.creditRepository.findById(creditRequestId);
    if (!creditRequest) {
      throw new NotFoundException('Credit request not found');
    }

    if (creditRequest.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    if (creditRequest.status !== CreditStatus.ACTIVE) {
      throw new BadRequestException('Credit request is not active');
    }

    // Check if user has sufficient balance in savings account
    const savingsAccount = await this.savingsService.getBalance(userId);
    if (savingsAccount.balance < repayCreditDto.amount) {
      throw new BadRequestException('Insufficient balance in savings account');
    }

    // Execute repayment transaction
    const repayment = await this.creditRepository.executeRepayment(
      creditRequestId,
      repayCreditDto.amount,
      repayCreditDto.notes,
    );

    // Withdraw from savings account
    await this.savingsService.withdraw(userId, {
      amount: repayCreditDto.amount,
      description: `Credit repayment - ${creditRequestId}`,
    });

    // Send notification
    await this.notificationsService.createNotification(
      userId,
      'Repayment Successful',
      `Your repayment of $${repayCreditDto.amount} has been processed.`,
      'repayment_completed' as any,
    );

    return this.toCreditRepaymentResponseDto(repayment);
  }

  async getRepayments(
    userId: string,
    creditRequestId: string,
  ): Promise<CreditRepaymentResponseDto[]> {
    // Verify credit request belongs to user
    const creditRequest = await this.creditRepository.findById(creditRequestId);
    if (!creditRequest) {
      throw new NotFoundException('Credit request not found');
    }

    if (creditRequest.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    const repayments = await this.creditRepository.getRepayments(creditRequestId);
    return repayments.map((repayment) => this.toCreditRepaymentResponseDto(repayment));
  }

  async deleteCreditRequest(userId: string, creditRequestId: string): Promise<void> {
    const creditRequest = await this.creditRepository.findById(creditRequestId);
    if (!creditRequest) {
      throw new NotFoundException('Credit request not found');
    }

    if (creditRequest.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    if (creditRequest.status === CreditStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete active credit request');
    }

    await this.creditRepository.deleteCreditRequest(creditRequestId);
  }

  private calculateInterestRate(creditScore: number): number {
    // Base interest rate calculation based on credit score
    if (creditScore >= 750) {
      return 5.0; // Excellent credit
    } else if (creditScore >= 700) {
      return 7.5; // Good credit
    } else if (creditScore >= 650) {
      return 10.0; // Fair credit
    } else {
      return 15.0; // Poor credit
    }
  }

  private toCreditRequestResponseDto(
    creditRequest: CreditRequest,
  ): CreditRequestResponseDto {
    return plainToClass(CreditRequestResponseDto, creditRequest);
  }

  private toCreditRepaymentResponseDto(
    repayment: CreditRepayment,
  ): CreditRepaymentResponseDto {
    return plainToClass(CreditRepaymentResponseDto, repayment);
  }
}
