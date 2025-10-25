import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SavingsService } from './savings.service';
import { CreateSavingsAccountDto } from './dto/create-savings-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { SavingsAccountResponseDto } from './dto/savings-account-response.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('Savings')
@Controller('savings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post('account')
  @ApiOperation({ summary: 'Create a savings account' })
  @ApiResponse({
    status: 201,
    description: 'Savings account created successfully',
    type: SavingsAccountResponseDto,
  })
  async createAccount(
    @CurrentUser('id') userId: string,
    @Body() createSavingsAccountDto: CreateSavingsAccountDto,
  ): Promise<SavingsAccountResponseDto> {
    return await this.savingsService.createAccount(userId, createSavingsAccountDto);
  }

  @Get('account')
  @ApiOperation({ summary: 'Get savings account details' })
  @ApiResponse({
    status: 200,
    description: 'Savings account retrieved successfully',
    type: SavingsAccountResponseDto,
  })
  async getAccount(
    @CurrentUser('id') userId: string,
  ): Promise<SavingsAccountResponseDto> {
    return await this.savingsService.getAccount(userId);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiResponse({
    status: 200,
    description: 'Balance retrieved successfully',
  })
  async getBalance(@CurrentUser('id') userId: string) {
    return await this.savingsService.getBalance(userId);
  }

  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deposit money into savings account' })
  @ApiResponse({
    status: 200,
    description: 'Deposit successful',
    type: TransactionResponseDto,
  })
  async deposit(
    @CurrentUser('id') userId: string,
    @Body() depositDto: DepositDto,
  ): Promise<TransactionResponseDto> {
    return await this.savingsService.deposit(userId, depositDto);
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw money from savings account' })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal successful',
    type: TransactionResponseDto,
  })
  async withdraw(
    @CurrentUser('id') userId: string,
    @Body() withdrawDto: WithdrawDto,
  ): Promise<TransactionResponseDto> {
    return await this.savingsService.withdraw(userId, withdrawDto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: [TransactionResponseDto],
  })
  async getTransactions(
    @CurrentUser('id') userId: string,
  ): Promise<TransactionResponseDto[]> {
    return await this.savingsService.getTransactions(userId);
  }
}

