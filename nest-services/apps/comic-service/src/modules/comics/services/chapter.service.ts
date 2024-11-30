import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ChapterDao } from '../dao/chapter.dao';
import { CreateChapterDto } from '../dto/chapter.dto';
import { ChapterData } from '../model/chapter';
import { ComicsService } from './comics.service';

@Injectable()
export class ChapterService {
  private logger = new Logger(ChapterService.name);

  constructor(
    private readonly chapterDao: ChapterDao,
    private readonly comicService: ComicsService,
  ) {}

  async createChapter(chapterData: CreateChapterDto): Promise<ChapterData> {
    await this.comicService.getComic(chapterData.comic.toString());

    const existingChapter = await this.chapterDao.getChapterByComicAndEpisode(
      chapterData.comic,
      chapterData.episode,
    );
    if (existingChapter) {
      this.logger.error('Current episode is already taken.', { chapterData });
      throw new HttpException(
        'Current episode is already taken.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newChapter = await this.chapterDao.createChapter(chapterData);

    this.logger.log('Chapter created.', { chapterData });

    return newChapter;
  }

  async getChapter(id: string) {
    const chapter = await this.chapterDao.getChapterById(id);

    if (chapter == null) {
      this.logger.error('No chapter was found for the provided id.', { id });
      throw new HttpException(
        'No chapter was found for the provided id.',
        HttpStatus.NOT_FOUND,
      );
    }

    return chapter;
  }

  async checkAuthorCanModifyChapter(
    authorId: string,
    comicId: string,
    chapterId: string,
  ): Promise<void> {
    const comic = await this.comicService.getComic(comicId);
    if (!comic.author.includes(authorId)) {
      throw new ForbiddenException(
        'Chapter images cannot be added to provided comic',
      );
    }
    await this.getChapter(chapterId);
  }
}
