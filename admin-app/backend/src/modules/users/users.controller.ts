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
import { UsersService } from './users.service';

@ApiTags('User Management')
@Controller('users')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return await this.usersService.getAllUsers(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  async getUserDetails(@Param('id') userId: string) {
    return await this.usersService.getUserDetails(userId);
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Activate or deactivate user' })
  async toggleStatus(@Param('id') userId: string) {
    return await this.usersService.toggleUserStatus(userId);
  }

  @Put(':id/credit-score')
  @ApiOperation({ summary: 'Update user credit score' })
  async updateCreditScore(
    @Param('id') userId: string,
    @Body('creditScore') creditScore: number,
  ) {
    return await this.usersService.updateCreditScore(userId, creditScore);
  }
}

