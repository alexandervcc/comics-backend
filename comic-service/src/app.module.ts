import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaModule } from './modules/kafka/kafka.module';
import { AppController } from './app.controller';
import { RequestService } from './request.service';
import { AppService } from './app.service';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { AuthGuard } from './guards/auth.guard';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ComicsModule } from './comics/comics.module';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      // @ts-ignore
      useFactory: async (configService: ConfigService) => {
        const passphrase = configService.get<string>('REDIS_PASS');
        return {
          store: redisStore,
          url: `redis://:${passphrase}@localhost:6379`,
          isGlobal: true,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    KafkaModule,
    ComicsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RequestService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
      scope: Scope.REQUEST,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
    //.forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
