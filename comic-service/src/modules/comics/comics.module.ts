import { Module } from '@nestjs/common';
import { ComicsService } from './services/comics.service';
import { ComicsController } from './controllers/comics.controller';
import { KafkaModule } from 'src/modules/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [ComicsController],
  providers: [ComicsService],
})
export class ComicsModule {}
