import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS – in development also allow the backend's own origin so Swagger
  // "Try it out" requests (Origin: http://localhost:<port>) are not blocked.
  const port = process.env.PORT ?? 4000;
  const allowedOrigins =
    process.env.NODE_ENV !== 'production'
      ? [
          process.env.FRONTEND_URL ?? 'http://localhost:3000',
          `http://localhost:${port}`,
        ]
      : process.env.FRONTEND_URL ?? 'http://localhost:3000';

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  const prefix = process.env.API_PREFIX ?? 'api';
  app.setGlobalPrefix(prefix);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger (disable in production)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SVS Devasthanam API')
      .setDescription('Sri Venkata Sai Devasthanam REST API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${prefix}/docs`, app, document);
  }

  await app.listen(port);
  console.log(`🕉️  SVS Devasthanam API running on http://localhost:${port}/${prefix}`);
}

bootstrap();
