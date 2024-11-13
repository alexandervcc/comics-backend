import { Injectable, Logger } from '@nestjs/common';
import { ChapterDao } from '../dao/chapter.dao';

@Injectable()
export class ChapterService {
  private logger = new Logger(ChapterService.name);
  constructor(private readonly chapterDao: ChapterDao) {}
}
