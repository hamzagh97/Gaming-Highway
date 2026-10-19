import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { PlatformsModule } from './platforms/platforms.module';
import { GenresModule } from './genres/genres.module';
import { validate } from './config/env.validation';
import { randomUUID } from 'node:crypto';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : { target: 'pino-pretty', options: { singleLine: true } },
            autoLogging: {
              ignore: (req) => req.url === '/favicon.ico',
            },
            serializers: {
              req: (req: { method: string; url?: string }) => ({
                method: req.method,
                url: req.url?.split('?')[0],
              }),
              res: (res: { statusCode: number }) => ({
                statusCode: res.statusCode,
              }),
            },
            genReqId: (req, res) => {
              const id = randomUUID();
              res.setHeader('X-Request-Id', id);
              return id;
            },
          },
        };
      },
    }),
    HealthModule,
    PlatformsModule,
    GenresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
