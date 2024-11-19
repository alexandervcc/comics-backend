import { Controller, Get } from '@nestjs/common';
import { ComicServiceService } from './comic-service.service';

@Controller()
export class ComicServiceController {
  constructor(private readonly comicServiceService: ComicServiceService) {}

  @Get()
  getHello(): string {
    return this.comicServiceService.getHello();
  }
}
