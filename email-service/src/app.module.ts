import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailConsumerModule } from './email-consumer/email-consumer.module';

@Module({
  imports: [EmailConsumerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
