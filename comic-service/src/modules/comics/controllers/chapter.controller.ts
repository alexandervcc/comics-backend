import { Controller, Post } from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';
import { CreateChapterDto } from '../dto/ChapterDto';

@Controller('api/v1/chapter')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}
  @Post()
  async createChapter(chapterData: CreateChapterDto) {
    return this.chapterService.createChapter(chapterData);
  }
}
