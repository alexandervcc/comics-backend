import {
  Injectable,
  BadRequestException,
  Logger,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { ComicsService } from './comics.service';
import { ChapterService } from './chapter.service';
import { AddPagesToChapterDto } from '../dto/chapter.dto';

@Injectable()
export class ChapterImagesService {
  private readonly uploadDir = './uploads/chapters';
  private readonly maxFileSize = 5 * 1024 * 1024;
  private readonly allowedResolutions = [
    { width: 1920, height: 1080 },
    { width: 3840, height: 2160 },
  ];
  private readonly resizeResolutions = [
    { name: 'fullhd', width: 1920, height: 1080 },
    { name: '4k', width: 3840, height: 2160 },
    { name: 'mobile', width: 800, height: 600 },
  ];
  private logger = new Logger(ChapterImagesService.name);

  constructor(
    private readonly chapterService: ChapterService,
    private readonly comicService: ComicsService,
  ) {}

  async handleUpload(
    chapterData: AddPagesToChapterDto,
    files: Express.Multer.File[],
  ): Promise<void> {
    const { authorId, chapterId, comicId } = chapterData;

    await this.checkAuthorCanModifyChapter(authorId, comicId, chapterId);

    const chapterDir = this.getChapterDirectory(chapterId);

    await this.ensureDirectoryExists(chapterDir);

    this.validateFiles(files);

    await this.saveFiles(chapterDir, files);

    // TODO: Emit event to resize events for different screen sizes
  }

  //   async resizeAndSaveImages(chapterId: string) {}

  private async checkAuthorCanModifyChapter(
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
    await this.chapterService.getChapter(chapterId);
  }

  private validateFiles(files: Express.Multer.File[]): void {
    for (const file of files) {
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds the maximum size of 5MB.`,
        );
      }

      const isValidResolution = this.allowedResolutions.some(async (res) => {
        const metadata = await sharp(file.buffer).metadata();
        return metadata.width === res.width && metadata.height === res.height;
      });

      if (!isValidResolution) {
        throw new BadRequestException(
          `File ${file.originalname} does not meet the required resolution (Full HD, 4K, or cellphone).`,
        );
      }
    }
  }

  private async saveFiles(
    chapterDir: string,
    files: Express.Multer.File[],
  ): Promise<void> {
    try {
      await Promise.all(
        files.map((file) => {
          const filePath = path.join(chapterDir, file.originalname);
          fs.promises.writeFile(filePath, file.buffer);
        }),
      );
      this.logger.log('Chapter images successfully saved.', { chapterDir });
    } catch (error) {
      throw new HttpException(
        'Error saving images, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getChapterDirectory(chapterId: string): string {
    const chatperPath = path.join(this.uploadDir, chapterId);
    this.logger.log('Chapter for images obtained.', { chatperPath, chapterId });
    return chatperPath;
  }

  private async ensureDirectoryExists(dir: string): Promise<void> {
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }
}
