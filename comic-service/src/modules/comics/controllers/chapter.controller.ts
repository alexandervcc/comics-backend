import { Controller, Get, Post, Param } from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';
import { CreateChapterDto } from '../dto/chapter.dto';

@Controller('api/v1/chapter')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Post()
  async createChapter(chapterData: CreateChapterDto) {
    return this.chapterService.createChapter(chapterData);
  }

  @Get('/:id')
  async getChapter(@Param('id') id: string) {
    return this.chapterService.getChapter(id);
  }
}
