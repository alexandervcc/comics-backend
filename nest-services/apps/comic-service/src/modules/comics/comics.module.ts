import { Module } from '@nestjs/common';
import { ComicsService } from './services/comics.service';
import { ComicsController } from './controllers/comics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComicModel, ComicSchema } from './model/comic';
import { ComicDao } from './dao/comic.dao';
import { ChapterModel, ChapterSchema } from './model/chapter';
import { ChapterController } from './controllers/chapter.controller';
import { ChapterService } from './services/chapter.service';
import { ChapterDao } from './dao/chapter.dao';
import { KafkaModule } from '../kafka/kafka.module';
import { AuthorModule } from '../author/author.module';
import { ChapterImagesService } from './services/chapter-images.service';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      { name: ComicModel.name, schema: ComicSchema },
      { name: ChapterModel.name, schema: ChapterSchema },
    ]),
    AuthorModule,
  ],
  controllers: [ComicsController, ChapterController],
  providers: [
    ComicsService,
    ComicDao,
    ChapterService,
    ChapterDao,
    ChapterImagesService,
  ],
})
export class ComicsModule {}
