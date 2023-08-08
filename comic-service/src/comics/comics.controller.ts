import { Body, Controller, Post } from '@nestjs/common';
import { ComicsService } from './comics.service';

@Controller('comics')
export class ComicsController {
  constructor(private comicsService: ComicsService) {}

  @Post()
  async createComic(@Body() comic: Record<string, unknown>) {
    return this.comicsService.createNewComic(comic);
  }
}
