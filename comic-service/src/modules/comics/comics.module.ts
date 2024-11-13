import { Module } from '@nestjs/common';
import { ComicsService } from './services/comics.service';
import { ComicsController } from './controllers/comics.controller';
import { KafkaModule } from 'src/modules/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ComicModel, ComicSchema } from './model/comic';
import { ComicDao } from './dao/comic.dao';
import { AuthorModule } from 'src/modules/author/author.module';
import { ChapterModel, ChapterSchema } from './model/chapter';
import { ChapterController } from './controllers/chapter.controller';
import { ChapterService } from './services/chapter.service';
import { ChapterDao } from './dao/chapter.dao';

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
  providers: [ComicsService, ComicDao, ChapterService, ChapterDao],
})
export class ComicsModule {}
