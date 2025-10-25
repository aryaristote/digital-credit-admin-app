import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreditService } from './credit.service';

@ApiTags('Credit Management')
@Controller('credit')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiBearerAuth('JWT-auth')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Get pending credit requests' })
  async getPendingRequests(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.creditService.getPendingRequests(page, limit);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all credit requests' })
  async getAllRequests(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    console.log('📥 [CREDIT CONTROLLER] Fetching credit requests - status:', status || 'all');
    const result = await this.creditService.getAllRequests(page, limit, status);
    console.log('✅ [CREDIT CONTROLLER] Found', result.total, 'credit requests');
    return result;
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get credit statistics' })
  async getStats() {
    return await this.creditService.getCreditStats();
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve credit request' })
  async approveRequest(
    @Param('id') requestId: string,
    @CurrentUser('id') adminId: string,
    @Body('approvedAmount') approvedAmount?: number,
  ) {
    return await this.creditService.approveRequest(requestId, adminId, approvedAmount);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject credit request' })
  async rejectRequest(
    @Param('id') requestId: string,
    @CurrentUser('id') adminId: string,
    @Body('reason') reason: string,
  ) {
    return await this.creditService.rejectRequest(requestId, adminId, reason);
  }
}

