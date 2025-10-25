import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { Session } from './entities/session.entity';

interface CreateSessionData {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  deviceName?: string;
  deviceType?: string;
  browser?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async createSession(data: CreateSessionData): Promise<Session> {
    return await this.sessionsRepository.create(data);
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return await this.sessionsRepository.findByUserId(userId);
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return await this.sessionsRepository.findByRefreshToken(refreshToken);
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.sessionsRepository.invalidate(sessionId);
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.sessionsRepository.invalidateAllUserSessions(userId);
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.sessionsRepository.deleteExpiredSessions();
  }
}

