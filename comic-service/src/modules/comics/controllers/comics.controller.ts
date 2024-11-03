import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ComicsService } from '../services/comics.service';
import { ComicDataDto } from '../dto/ComicData';

@Controller('api/v1/comic')
export class ComicsController {
  constructor(private comicsService: ComicsService) {}

  @Post()
  async createComic(@Body() comic: ComicDataDto) {
    return this.comicsService.createNewComic(comic);
  }

  @Get('/:id')
  async getComicData(@Param('id') id: string): Promise<ComicDataDto> {
    return this.comicsService.getComic(id);
  }
}
