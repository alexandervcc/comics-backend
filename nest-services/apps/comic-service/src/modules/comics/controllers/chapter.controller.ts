import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';
import { AddPagesToChapterDto, CreateChapterDto } from '../dto/chapter.dto';
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

  @Post('/pages')
  @UseInterceptors(FilesInterceptor('images', 50))
  async addPagesToChapter(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() payload: AddPagesToChapterDto,
  ) {
    return this.chapterImagesService.handleUpload(payload, files);
  }

  @Get('/:id')
  async getChapter(@Param('id') id: string) {
    return this.chapterService.getChapter(id);
  }
}
