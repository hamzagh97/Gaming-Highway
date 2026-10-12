import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip fields the DTO doesn't declare
      forbidNonWhitelisted: true, // reject requests with unknown fields
      transform: true, // turn query strings into real numbers, etc.
    }),
  );

  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  const isProduction = config.get('NODE_ENV') === 'production';
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Gaming Highway TN API')
      .setDescription('Backend API for the Gaming Highway TN shop')
      .setVersion('0.1')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }
  await app.listen(config.get<number>('PORT') ?? 4000);
}
void bootstrap();
