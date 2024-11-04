import { Module } from '@nestjs/common';
import { ComicsService } from './services/comics.service';
import { ComicsController } from './controllers/comics.controller';
import { KafkaModule } from 'src/modules/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ComicModel, ComicSchema } from './model/Comic';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([{ name: ComicModel.name, schema: ComicSchema }]),
  ],
  controllers: [ComicsController],
  providers: [ComicsService],
})
export class ComicsModule {}
