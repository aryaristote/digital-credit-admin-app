import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:9001',
      'http://localhost:5174',
      'http://localhost:3100',
      'http://localhost:5173',
      'http://localhost:9002',
    ],
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
      exceptionFactory: (errors) => {
        console.error(
          '❌ [VALIDATION] Validation errors:',
          JSON.stringify(errors, null, 2),
        );
        return new Error('Validation failed');
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters({
    catch(exception: any, host: any) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      console.error('❌ [EXCEPTION] Error occurred');
      console.error('❌ [EXCEPTION] Path:', request.url);
      console.error('❌ [EXCEPTION] Method:', request.method);
      console.error('❌ [EXCEPTION] Error:', exception);
      console.error('❌ [EXCEPTION] Stack:', exception.stack);

      const status = exception.status || 500;
      const message = exception.message || 'Internal server error';

      response.status(status).json({
        statusCode: status,
        message: message,
        error: exception.name || 'Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    },
  });

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

  const port = process.env.PORT || 9000;
  await app.listen(port);

  console.log(
    `🚀 Admin Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  console.log(`📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
