import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics & Calculators')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('financial-health')
  @ApiOperation({ summary: 'Get user financial health score and recommendations' })
  async getFinancialHealth(@CurrentUser('id') userId: string) {
    return await this.analyticsService.getFinancialHealth(userId);
  }

  @Get('repayment-calculator')
  @ApiOperation({ summary: 'Calculate credit repayment plan' })
  async calculateRepayment(
    @Query('principal') principal: number,
    @Query('interestRate') interestRate: number,
    @Query('termMonths') termMonths: number,
  ) {
    return await this.analyticsService.calculateRepaymentPlan(
      principal,
      interestRate,
      termMonths,
    );
  }
}
