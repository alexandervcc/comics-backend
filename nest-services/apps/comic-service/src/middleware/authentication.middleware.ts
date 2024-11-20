import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestService } from '../request.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);

  constructor(private requestService: RequestService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Client with id ${'mijotron'} authenticated.`);

    //TODO: Authentication
    this.requestService.setUserId('mijotron');

    next();
  }
}
