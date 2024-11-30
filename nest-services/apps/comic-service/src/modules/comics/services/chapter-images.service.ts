import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import { ChapterService } from './chapter.service';
import { AddPagesToChapterDto } from '../dto/chapter.dto';
import { ChapterLocalStorageService } from './chapter-local-storage.service';
import { BufferFile } from './interfaces/chapter-storage.interface';

@Injectable()
export class ChapterImagesService {
  private readonly maxFileSize = 5 * 1024 * 1024;
  private readonly allowedResolutions = [
    { width: 1080, height: 1920 },
    { width: 2160, height: 3840 },
  ];
  private readonly resizeResolutions = [
    { name: 'fullhd', width: 1080, height: 1920 },
    { name: '4k', width: 2160, height: 3840 },
    { name: 'mobile', width: 600, height: 800 },
  ];
  private logger = new Logger(ChapterImagesService.name);

  constructor(
    private readonly chapterService: ChapterService,
    private readonly localStorage: ChapterLocalStorageService,
  ) {}

  async handleUpload(
    chapterData: AddPagesToChapterDto,
    files: Express.Multer.File[],
  ): Promise<void> {
    const { authorId, chapterId, comicId } = chapterData;

    await this.chapterService.checkAuthorCanModifyChapter(
      authorId,
      comicId,
      chapterId,
    );

    const chapterDir = this.localStorage.getChapterDirectory(
      chapterId,
      'original',
    );

    this.validateFiles(files);

    await this.localStorage.saveFiles(chapterDir, files);

    // TODO: Emit event to resize events for different screen sizes, using Kafka
  }

  // TODO: consume this resizing method throug Kafka
  async resizeAndSaveImages(chapterId: string) {
    const files = await this.localStorage.getPagesFromStorage(
      chapterId,
      'original',
    );
    for (const res of this.resizeResolutions) {
      const resizedFiles: BufferFile[] = await Promise.all(
        files.map(async (file) => {
          const resizedFile = await sharp(file.filename)
            .resize(res.width, res.height)
            .toBuffer();

          this.logger.log('Image resized.', { chapterId, res });

          return {
            filename: file.filename,
            buffer: resizedFile,
          };
        }),
      );

      const newFilePath = this.localStorage.getChapterDirectory(
        chapterId,
        res.name,
      );
      await this.localStorage.saveFiles(newFilePath, resizedFiles);
    }
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
}
