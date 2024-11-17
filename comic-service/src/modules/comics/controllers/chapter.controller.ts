import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';
import { AddPagesDto, CreateChapterDto } from '../dto/chapter.dto';

@Controller('api/v1/chapter')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Post()
  async createChapter(chapterData: CreateChapterDto) {
    return this.chapterService.createChapter(chapterData);
  }

  @Post('/pages')
  async addPagesToChapter(@Body() data: AddPagesDto) {
    return this.chapterService.addPagesToChapter(data);
  }

  @Get('/:id')
  async getChapter(@Param('id') id: string) {
    return this.chapterService.getChapter(id);
  }
}
