import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreditRepository } from './credit.repository';
import { UsersService } from '../users/users.service';
import { SavingsService } from '../savings/savings.service';
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
    private readonly configService: ConfigService,
  ) {}

  async createCreditRequest(
    userId: string,
    createCreditRequestDto: CreateCreditRequestDto,
  ): Promise<CreditRequestResponseDto> {
    // Get user credit score
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has active credit requests
    const activeCreditRequests = await this.creditRepository.findActiveByUserId(userId);
    if (activeCreditRequests.length > 0) {
      throw new BadRequestException(
        'You already have an active credit request. Please complete it before requesting another.',
      );
    }

    // Calculate interest rate based on credit score
    const interestRate = this.calculateInterestRate(user.creditScore);

    // Create credit request
    const creditRequest = await this.creditRepository.createCreditRequest({
      userId,
      requestedAmount: createCreditRequestDto.requestedAmount,
      termMonths: createCreditRequestDto.termMonths,
      purpose: createCreditRequestDto.purpose,
      interestRate,
      status: CreditStatus.PENDING,
    });

    // Auto-approve or reject based on credit score (simulation)
    await this.processAutomaticApproval(creditRequest.id, user.creditScore);

    const updatedRequest = await this.creditRepository.findById(creditRequest.id);
    return this.toCreditRequestResponseDto(updatedRequest);
  }

  async getCreditRequests(userId: string): Promise<CreditRequestResponseDto[]> {
    const requests = await this.creditRepository.findByUserId(userId);
    return requests.map((req) => this.toCreditRequestResponseDto(req));
  }

  async getCreditRequest(
    userId: string,
    creditRequestId: string,
  ): Promise<CreditRequestResponseDto> {
    const request = await this.creditRepository.findById(creditRequestId);
    if (!request) {
      throw new NotFoundException('Credit request not found');
    }

    if (request.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    return this.toCreditRequestResponseDto(request);
  }

  async repayCredit(
    userId: string,
    creditRequestId: string,
    repayCreditDto: RepayCreditDto,
  ): Promise<CreditRepaymentResponseDto> {
    const creditRequest = await this.creditRepository.findById(creditRequestId);

    if (!creditRequest) {
      throw new NotFoundException('Credit request not found');
    }

    if (creditRequest.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    if (creditRequest.status !== CreditStatus.ACTIVE) {
      throw new BadRequestException(
        'Credit request is not active. Only active loans can be repaid.',
      );
    }

    // Calculate remaining balance
    const totalOwed =
      Number(creditRequest.approvedAmount) *
      (1 + Number(creditRequest.interestRate) / 100);
    const remainingBalance = totalOwed - Number(creditRequest.totalRepaid);

    if (repayCreditDto.amount > remainingBalance) {
      throw new BadRequestException(
        `Repayment amount exceeds remaining balance of ${remainingBalance.toFixed(2)}`,
      );
    }

    // Check if user has enough money in savings account
    const savingsAccount = await this.savingsService.getAccount(userId);
    if (Number(savingsAccount.balance) < repayCreditDto.amount) {
      throw new BadRequestException(
        `Insufficient funds. Your savings balance is ${Number(savingsAccount.balance).toFixed(2)} but you're trying to pay ${repayCreditDto.amount.toFixed(2)}`,
      );
    }

    // Withdraw from savings account first
    await this.savingsService.withdraw(userId, {
      amount: repayCreditDto.amount,
      notes: `Credit repayment for loan ${creditRequestId}`,
    });

    // Then process the credit repayment
    const repayment = await this.creditRepository.executeRepayment(
      creditRequestId,
      repayCreditDto.amount,
      repayCreditDto.notes,
    );

    return this.toCreditRepaymentResponseDto(repayment);
  }

  async getRepayments(
    userId: string,
    creditRequestId: string,
  ): Promise<CreditRepaymentResponseDto[]> {
    const creditRequest = await this.creditRepository.findById(creditRequestId);

    if (!creditRequest) {
      throw new NotFoundException('Credit request not found');
    }

    if (creditRequest.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    const repayments = await this.creditRepository.getRepayments(creditRequestId);
    return repayments.map((rep) => this.toCreditRepaymentResponseDto(rep));
  }

  async deleteCreditRequest(userId: string, creditRequestId: string): Promise<void> {
    const creditRequest = await this.creditRepository.findById(creditRequestId);

    if (!creditRequest) {
      throw new NotFoundException('Credit request not found');
    }

    if (creditRequest.userId !== userId) {
      throw new BadRequestException('Unauthorized access to credit request');
    }

    // Only allow deletion of pending or rejected requests
    if (
      creditRequest.status !== CreditStatus.PENDING &&
      creditRequest.status !== CreditStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Only pending or rejected credit requests can be deleted',
      );
    }

    await this.creditRepository.deleteCreditRequest(creditRequestId);
  }

  private async processAutomaticApproval(
    creditRequestId: string,
    creditScore: number,
  ): Promise<void> {
    const approvalThreshold = this.configService.get<number>(
      'CREDIT_APPROVAL_THRESHOLD',
      600,
    );

    const creditRequest = await this.creditRepository.findById(creditRequestId);

    if (creditScore >= approvalThreshold) {
      // Approve the request
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + creditRequest.termMonths);

      await this.creditRepository.updateStatus(creditRequestId, CreditStatus.ACTIVE, {
        approvedAmount: creditRequest.requestedAmount,
        approvedBy: 'SYSTEM',
        approvedAt: new Date(),
        dueDate,
      });
    } else {
      // Reject the request
      await this.creditRepository.updateStatus(creditRequestId, CreditStatus.REJECTED, {
        rejectionReason: `Credit score ${creditScore} is below minimum threshold of ${approvalThreshold}`,
      });
    }
  }

  private calculateInterestRate(creditScore: number): number {
    // Simple interest rate calculation based on credit score
    if (creditScore >= 750) return 5.0; // Excellent credit
    if (creditScore >= 700) return 7.5; // Good credit
    if (creditScore >= 650) return 10.0; // Fair credit
    if (creditScore >= 600) return 15.0; // Poor credit
    return 20.0; // Very poor credit
  }

  private toCreditRequestResponseDto(
    creditRequest: CreditRequest,
  ): CreditRequestResponseDto {
    return {
      id: creditRequest.id,
      userId: creditRequest.userId,
      requestedAmount: Number(creditRequest.requestedAmount),
      approvedAmount: creditRequest.approvedAmount
        ? Number(creditRequest.approvedAmount)
        : null,
      totalRepaid: Number(creditRequest.totalRepaid),
      interestRate: Number(creditRequest.interestRate),
      termMonths: creditRequest.termMonths,
      status: creditRequest.status,
      purpose: creditRequest.purpose,
      rejectionReason: creditRequest.rejectionReason,
      approvedBy: creditRequest.approvedBy,
      approvedAt: creditRequest.approvedAt,
      dueDate: creditRequest.dueDate,
      createdAt: creditRequest.createdAt,
      updatedAt: creditRequest.updatedAt,
    };
  }

  private toCreditRepaymentResponseDto(
    repayment: CreditRepayment,
  ): CreditRepaymentResponseDto {
    return {
      id: repayment.id,
      creditRequestId: repayment.creditRequestId,
      amount: Number(repayment.amount),
      status: repayment.status,
      reference: repayment.reference,
      notes: repayment.notes,
      createdAt: repayment.createdAt,
    };
  }
}
