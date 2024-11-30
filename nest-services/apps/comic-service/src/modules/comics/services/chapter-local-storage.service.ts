import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';

import * as path from 'path';
import {
  BufferFile,
  ChapterStorageI,
} from './interfaces/chapter-storage.interface';

@Injectable()
export class ChapterLocalStorageService implements ChapterStorageI {
  private readonly uploadDir = './uploads/chapters';
  private readonly logger = new Logger(ChapterLocalStorageService.name);

  async saveFiles(chapterDir: string, files: BufferFile[]): Promise<void> {
    try {
      await Promise.all(
        files.map((file) => {
          const filePath = path.join(chapterDir, file.filename);
          fs.promises.writeFile(filePath, file.buffer);
        }),
      );
      this.logger.log('Chapter images successfully saved.', { chapterDir });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving images, try again later.',
      );
    }
  }

  getChapterDirectory(chapterId: string, subpath: string): string {
    const chapterPath = path.join(this.uploadDir, subpath, chapterId);
    this.logger.log('Chapter for images obtained.', { chapterPath, chapterId });
    this.ensureDirectoryExists(chapterPath);
    return chapterPath;
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async getPagesFromStorage(
    chapterId: string,
    type: string,
  ): Promise<BufferFile[]> {
    const chapterDir = this.getChapterDirectory(chapterId, type);
    const fileNames = await fs.promises.readdir(chapterDir);
    return Promise.all(
      fileNames.map(async (file) => {
        const filePath = path.join(chapterDir, file);
        const buffer = await fs.promises.readFile(filePath);
        return {
          filename: file,
          buffer,
        };
      }),
    );
  }
}
