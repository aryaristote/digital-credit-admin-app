import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return await this.notificationRepository.save(notification);
  }

  async findByUserId(
    userId: string,
    limit: number = 50,
  ): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return await this.notificationRepository.findOne({ where: { id } });
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationRepository.update(id, { isRead: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async delete(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async countUnread(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }
}

