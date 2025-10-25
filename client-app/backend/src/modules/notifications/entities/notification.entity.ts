import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  metadata: string; // JSON string for additional data

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

