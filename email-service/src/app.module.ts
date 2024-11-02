import { Module } from '@nestjs/common';
import { EmailConsumerModule } from './modules/email-consumer/email-consumer.module';

@Module({
  imports: [EmailConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
