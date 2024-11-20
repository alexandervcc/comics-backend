import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { RequestService } from '../request.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  constructor(private requestService: RequestService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path } = request;

    this.logger.log(
      `${method} ${path} ${userAgent} ${ip}: ${context.getClass().name}::${
        context.getHandler().name
      }() invoked... `,
    );
    this.logger.log(`userId: ${this.requestService.getUserId()}`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        this.logger.log(
          `${method} ${path} ${statusCode} ${contentLength} - ${userAgent} ${ip} : ${
            Date.now() - now
          }ms`,
        );
      }),
    );
  }
}
