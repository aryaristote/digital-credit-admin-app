import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(sessionData: Partial<Session>): Promise<Session> {
    const session = this.sessionRepository.create(sessionData);
    return await this.sessionRepository.save(session);
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return await this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return await this.sessionRepository.findOne({
      where: { refreshToken, isActive: true },
    });
  }

  async invalidate(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, { isActive: false });
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false },
    );
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}

