import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  async getProfile(@CurrentUser('id') userId: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(userId);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Get('credit-score')
  @ApiOperation({ summary: 'Get current user credit score' })
  @ApiResponse({
    status: 200,
    description: 'Credit score retrieved successfully',
  })
  async getCreditScore(@CurrentUser('id') userId: string) {
    const user = await this.usersService.findOne(userId);
    return { creditScore: user.creditScore };
  }

  @Put('credit-score/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request credit score refresh' })
  @ApiResponse({
    status: 200,
    description: 'Credit score refreshed successfully',
  })
  async refreshCreditScore(@CurrentUser('id') userId: string) {
    const newScore = await this.usersService.updateCreditScore(userId);
    return { creditScore: newScore, message: 'Credit score updated successfully' };
  }
}

