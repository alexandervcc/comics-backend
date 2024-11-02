import { Module } from '@nestjs/common';
import { ComicsService } from './comics.service';
import { ComicsController } from './comics.controller';
import { KafkaModule } from 'src/modules/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [ComicsController],
  providers: [ComicsService],
})
export class ComicsModule {}
