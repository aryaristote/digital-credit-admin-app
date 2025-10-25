import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationsRepository } from './notifications.repository';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
    link?: string,
    metadata?: any,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationsRepository.create({
      userId,
      title,
      message,
      type,
      link,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });

    return this.toNotificationResponseDto(notification);
  }

  async getUserNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationsRepository.findByUserId(userId);
    return notifications.map((n) => this.toNotificationResponseDto(n));
  }

  async getUnreadNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationsRepository.findUnreadByUserId(
      userId,
    );
    return notifications.map((n) => this.toNotificationResponseDto(n));
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const notification = await this.notificationsRepository.findById(
      notificationId,
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationsRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.markAllAsRead(userId);
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const notification = await this.notificationsRepository.findById(
      notificationId,
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationsRepository.delete(notificationId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationsRepository.countUnread(userId);
  }

  // Email notification methods
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    await this.emailQueue.add('welcome', { email, firstName });
  }

  async sendCreditApprovalEmail(
    email: string,
    firstName: string,
    amount: number,
  ): Promise<void> {
    await this.emailQueue.add('credit-approved', { email, firstName, amount });
  }

  async sendCreditRejectionEmail(
    email: string,
    firstName: string,
    reason: string,
  ): Promise<void> {
    await this.emailQueue.add('credit-rejected', { email, firstName, reason });
  }

  private toNotificationResponseDto(
    notification: Notification,
  ): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      link: notification.link,
      metadata: notification.metadata
        ? JSON.parse(notification.metadata)
        : null,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}

