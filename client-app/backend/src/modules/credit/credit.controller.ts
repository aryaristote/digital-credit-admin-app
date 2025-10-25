import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreditService } from './credit.service';
import { CreateCreditRequestDto } from './dto/create-credit-request.dto';
import { RepayCreditDto } from './dto/repay-credit.dto';
import { CreditRequestResponseDto } from './dto/credit-request-response.dto';
import { CreditRepaymentResponseDto } from './dto/credit-repayment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('Credit')
@Controller('credit')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Post('request')
  @ApiOperation({ summary: 'Create a credit request' })
  @ApiResponse({
    status: 201,
    description: 'Credit request created successfully',
    type: CreditRequestResponseDto,
  })
  async createRequest(
    @CurrentUser('id') userId: string,
    @Body() createCreditRequestDto: CreateCreditRequestDto,
  ): Promise<CreditRequestResponseDto> {
    return await this.creditService.createCreditRequest(
      userId,
      createCreditRequestDto,
    );
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get all credit requests for current user' })
  @ApiResponse({
    status: 200,
    description: 'Credit requests retrieved successfully',
    type: [CreditRequestResponseDto],
  })
  async getRequests(
    @CurrentUser('id') userId: string,
  ): Promise<CreditRequestResponseDto[]> {
    return await this.creditService.getCreditRequests(userId);
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get specific credit request' })
  @ApiResponse({
    status: 200,
    description: 'Credit request retrieved successfully',
    type: CreditRequestResponseDto,
  })
  async getRequest(
    @CurrentUser('id') userId: string,
    @Param('id') creditRequestId: string,
  ): Promise<CreditRequestResponseDto> {
    return await this.creditService.getCreditRequest(userId, creditRequestId);
  }

  @Post('requests/:id/repay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Make a repayment on a credit request' })
  @ApiResponse({
    status: 200,
    description: 'Repayment successful',
    type: CreditRepaymentResponseDto,
  })
  async repayCredit(
    @CurrentUser('id') userId: string,
    @Param('id') creditRequestId: string,
    @Body() repayCreditDto: RepayCreditDto,
  ): Promise<CreditRepaymentResponseDto> {
    return await this.creditService.repayCredit(
      userId,
      creditRequestId,
      repayCreditDto,
    );
  }

  @Get('requests/:id/repayments')
  @ApiOperation({ summary: 'Get repayment history for a credit request' })
  @ApiResponse({
    status: 200,
    description: 'Repayments retrieved successfully',
    type: [CreditRepaymentResponseDto],
  })
  async getRepayments(
    @CurrentUser('id') userId: string,
    @Param('id') creditRequestId: string,
  ): Promise<CreditRepaymentResponseDto[]> {
    return await this.creditService.getRepayments(userId, creditRequestId);
  }

  @Delete('requests/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a credit request' })
  @ApiResponse({
    status: 200,
    description: 'Credit request deleted successfully',
  })
  async deleteRequest(
    @CurrentUser('id') userId: string,
    @Param('id') creditRequestId: string,
  ): Promise<{ message: string }> {
    await this.creditService.deleteCreditRequest(userId, creditRequestId);
    return { message: 'Credit request deleted successfully' };
  }
}

