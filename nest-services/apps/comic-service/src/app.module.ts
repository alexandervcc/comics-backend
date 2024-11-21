import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { redisStore } from 'cache-manager-redis-store';

import { ComicsModule } from './modules/comics/comics.module';
import { AuthorModule } from './modules/author/author.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { AuthGuard } from './guards/auth.guard';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RequestService } from './request.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            passphrase: configService.get<string>('REDIS_PASS'),
          },
        });
        return {
          store: store as unknown as CacheStore,
          ttl: 60000,
          isGlobal: true,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    KafkaModule,
    ComicsModule,
    AuthorModule,
  ],
  controllers: [],
  providers: [
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
