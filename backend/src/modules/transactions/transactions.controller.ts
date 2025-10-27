import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { TransactionsService } from './transactions.service';

@ApiTags('Transaction Management')
@Controller('transactions')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiBearerAuth('JWT-auth')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions with pagination' })
  async getTransactions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('type') type?: string,
  ) {
    console.log('📥 [TRANSACTIONS CONTROLLER] Fetching transactions - type:', type || 'all');
    const result = await this.transactionsService.getAllTransactions(page, limit, type);
    console.log('✅ [TRANSACTIONS CONTROLLER] Found', result.total, 'transactions');
    return result;
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get transaction statistics' })
  async getStats() {
    return await this.transactionsService.getTransactionStats();
  }
}

