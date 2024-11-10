import { Module } from '@nestjs/common';
import { ComicsService } from './services/comics.service';
import { ComicsController } from './controllers/comics.controller';
import { KafkaModule } from 'src/modules/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ComicModel, ComicSchema } from './model/comic';
import { ComicDao } from './dao/comic.dao';
import { AuthorModule } from 'src/modules/author/author.module';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([{ name: ComicModel.name, schema: ComicSchema }]),
    AuthorModule,
  ],
  controllers: [ComicsController],
  providers: [ComicsService, ComicDao],
})
export class ComicsModule {}
