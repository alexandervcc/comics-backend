import { Module } from '@nestjs/common';
import { EmailConsumerController } from './email-consumer.controller';
import { EmailConsumerService } from './email-consumer.service';

@Module({
  controllers: [EmailConsumerController],
  providers: [EmailConsumerService]
})
export class EmailConsumerModule {}
