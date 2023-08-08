import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
    //.forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
