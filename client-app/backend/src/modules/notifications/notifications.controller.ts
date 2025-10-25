import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: [NotificationResponseDto],
  })
  async getNotifications(
    @CurrentUser('id') userId: string,
  ): Promise<NotificationResponseDto[]> {
    return await this.notificationsService.getUserNotifications(userId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread notifications' })
  @ApiResponse({
    status: 200,
    description: 'Unread notifications retrieved successfully',
    type: [NotificationResponseDto],
  })
  async getUnreadNotifications(
    @CurrentUser('id') userId: string,
  ): Promise<NotificationResponseDto[]> {
    return await this.notificationsService.getUnreadNotifications(userId);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(@CurrentUser('id') userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Put(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
  })
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') notificationId: string,
  ): Promise<{ message: string }> {
    await this.notificationsService.markAsRead(userId, notificationId);
    return { message: 'Notification marked as read' };
  }

  @Put('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
  })
  async markAllAsRead(@CurrentUser('id') userId: string): Promise<{ message: string }> {
    await this.notificationsService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  async deleteNotification(
    @CurrentUser('id') userId: string,
    @Param('id') notificationId: string,
  ): Promise<{ message: string }> {
    await this.notificationsService.deleteNotification(userId, notificationId);
    return { message: 'Notification deleted successfully' };
  }
}
