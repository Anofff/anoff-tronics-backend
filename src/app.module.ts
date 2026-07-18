import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  appConfig,
  jwtConfig,
  paystackConfig,
  cloudinaryConfig,
} from './config/app.config';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Config — available globally everywhere via ConfigService.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, paystackConfig, cloudinaryConfig],
      cache: true,
    }),

    // Rate limiting — applied globally to all routes.
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60_000, limit: 100 },
      { name: 'long', ttl: 3_600_000, limit: 1000 },
    ]),

    // Feature modules are added milestone by milestone.
  ],
  controllers: [AppController],
})
export class AppModule {}
