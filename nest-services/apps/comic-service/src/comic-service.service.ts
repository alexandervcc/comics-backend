import { Injectable } from '@nestjs/common';

@Injectable()
export class ComicServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
