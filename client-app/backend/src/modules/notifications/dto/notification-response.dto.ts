import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../entities/notification.entity';

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  link: string;

  @ApiProperty()
  metadata: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

