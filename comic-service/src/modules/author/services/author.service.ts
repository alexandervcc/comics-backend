import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthorService {
  private logger = new Logger(AuthorService.name);
}
