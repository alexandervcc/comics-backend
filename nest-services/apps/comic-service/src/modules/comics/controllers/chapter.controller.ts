import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';
import { CreateChapterDto } from '../dto/chapter.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ChapterImagesService } from '../services/chapter-images.service';

@Controller('api/v1/chapter')
export class ChapterController {
  constructor(
    private chapterService: ChapterService,
    private chapterImagesService: ChapterImagesService,
  ) {}

  @Post()
  async createChapter(chapterData: CreateChapterDto) {
    return this.chapterService.createChapter(chapterData);
  }

  @Post('/:comidId/pages')
  @UseInterceptors(FilesInterceptor('images', 50))
  async addPagesToChapter(
    @Param('id') chapterId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.chapterImagesService.handleUpload(chapterId, files);
  }

  @Get('/:id')
  async getChapter(@Param('id') id: string) {
    return this.chapterService.getChapter(id);
  }
}
