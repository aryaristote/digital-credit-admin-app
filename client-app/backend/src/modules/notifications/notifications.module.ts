import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { EmailProcessor } from './processors/email.processor';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository, EmailProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}

