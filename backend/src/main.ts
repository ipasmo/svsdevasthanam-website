import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { isSwaggerEnabled, parseAllowedOrigins } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Render sends SIGTERM on redeploy; this lets PrismaService disconnect cleanly.
  app.enableShutdownHooks();

  // Security
  app.use(helmet());

  // CORS – FRONTEND_URL is a comma-separated list of exact origins (no wildcards,
  // because credentials are allowed). In development also allow the backend's own
  // origin so Swagger "Try it out" requests are not blocked.
  const port = process.env.PORT ?? 4000;
  const frontendOrigins = parseAllowedOrigins(process.env.FRONTEND_URL);
  const allowedOrigins =
    process.env.NODE_ENV !== 'production'
      ? [
          ...(frontendOrigins.length ? frontendOrigins : ['http://localhost:3000']),
          `http://localhost:${port}`,
        ]
      : frontendOrigins;

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

  // Swagger: off in production unless SWAGGER_ENABLED=true (used by the cloud dev backend)
  if (isSwaggerEnabled(process.env)) {
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
