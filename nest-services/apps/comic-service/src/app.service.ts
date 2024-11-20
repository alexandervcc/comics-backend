import { Injectable, Logger } from '@nestjs/common';
import { RequestService } from './request.service';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(private requestService: RequestService) {}

  getHello(): string {
    const userId = this.requestService.getUserId();
    this.logger.log(`getHello: ${userId}`);
    return 'Hello World!';
  }
}
