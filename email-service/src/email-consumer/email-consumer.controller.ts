import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailConsumerService } from './email-consumer.service';
import { EmailDto } from 'src/model/EmailDto';

@Controller()
export class EmailConsumerController {
  constructor(private readonly emailConsumerService: EmailConsumerService) {}

  @EventPattern('send-email')
  async sendEmail(@Payload() emailData: EmailDto) {
    await this.emailConsumerService.sendEmail(emailData);
  }
}
