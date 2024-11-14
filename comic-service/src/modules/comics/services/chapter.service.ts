import { Injectable, Logger } from '@nestjs/common';
import { ChapterDao } from '../dao/chapter.dao';
import { CreateChapterDto } from '../dto/ChapterDto';
import { ChapterData } from '../model/chapter';

@Injectable()
export class ChapterService {
  private logger = new Logger(ChapterService.name);
  constructor(private readonly chapterDao: ChapterDao) {}

  async createChapter(chapterData: CreateChapterDto): Promise<ChapterData> {
    const newChapter = await this.chapterDao.createChapter(chapterData);
    return newChapter;
  }
}
