import { Controller } from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';

@Controller('api/v1/chapter')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}
}
