import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  deviceName: string;

  @Column({ nullable: true })
  deviceType: string;

  @Column({ nullable: true })
  browser: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

