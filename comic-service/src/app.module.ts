import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { FreezePipe } from './pipes/freeze.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [KafkaModule],
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
