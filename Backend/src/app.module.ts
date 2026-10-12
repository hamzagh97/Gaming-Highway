import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
                url: req.url,
              }),
              res: (res: { statusCode: number }) => ({
                statusCode: res.statusCode,
              }),
            },
          },
        };
      },
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
