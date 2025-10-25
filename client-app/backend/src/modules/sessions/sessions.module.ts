import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { Session } from './entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionsService, SessionsRepository],
  exports: [SessionsService],
})
export class SessionsModule {}

