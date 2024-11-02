import { Module } from '@nestjs/common';
import { EmailConsumerController } from './controllers/email-consumer.controller';
import { EmailConsumerService } from './services/email-consumer.service';

@Module({
  controllers: [EmailConsumerController],
  providers: [EmailConsumerService],
})
export class EmailConsumerModule {}
