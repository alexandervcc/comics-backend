import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { KafkaModule } from './modules/kafka/kafka.module';

import { AppController } from './app.controller';

import { RequestService } from './request.service';
import { AppService } from './app.service';

import { AuthenticationMiddleware } from './middleware/authentication.middleware';

import { AuthGuard } from './guards/auth.guard';

import { LoggingInterceptor } from './interceptor/logging.interceptor';

import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ComicsController } from './comics/comics.controller';
import { ComicsModule } from './comics/comics.module';

@Module({
  imports: [
    KafkaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ComicsModule,
  ],
  controllers: [AppController, ComicsController],
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
