import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check application health status' })
  async checkHealth() {
    const dbStatus = await this.checkDatabase();

    return {
      status: dbStatus.connected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbStatus.connected,
        message: dbStatus.message,
        host: (this.dataSource.options as PostgresConnectionOptions).host,
        port: (this.dataSource.options as PostgresConnectionOptions).port,
        database: (this.dataSource.options as PostgresConnectionOptions).database,
      },
    };
  }

  private async checkDatabase(): Promise<{ connected: boolean; message: string }> {
    try {
      if (!this.dataSource.isInitialized) {
        return {
          connected: false,
          message: 'Database connection not initialized',
        };
      }

      // Try to run a simple query
      await this.dataSource.query('SELECT 1');

      return {
        connected: true,
        message: 'Database connection successful',
      };
    } catch (error) {
      return {
        connected: false,
        message: `Database connection failed: ${error.message}`,
      };
    }
  }
}
