import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Test database connection
  try {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    if (dataSource.isInitialized) {
      console.log('✅ Database connection established successfully');
      console.log(
        `📊 Connected to: ${dataSource.options.database} @ ${dataSource.options.host}:${dataSource.options.port}`,
      );
    } else {
      console.log('⚠️  Database connection not yet initialized');
    }
  } catch (error: any) {
    console.error('❌ Database connection failed:', error?.message || error);
    console.error(
      'Please check your database configuration and ensure PostgreSQL is running',
    );
  }

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: ['http://localhost:5174', 'http://localhost:3100', 'http://localhost:5173'],
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Digital Credit & Savings Platform - Admin API')
    .setDescription(
      'API documentation for admin operations including user management, credit approvals, and system analytics',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(
    `🚀 Admin Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  console.log(`📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
