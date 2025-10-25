import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats() {
    return await this.analyticsService.getDashboardStats();
  }

  @Get('credit-score-distribution')
  @ApiOperation({ summary: 'Get credit score distribution' })
  async getCreditScoreDistribution() {
    return await this.analyticsService.getCreditScoreDistribution();
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent activity' })
  async getRecentActivity(@Query('limit') limit: number = 10) {
    return await this.analyticsService.getRecentActivity(limit);
  }
}

