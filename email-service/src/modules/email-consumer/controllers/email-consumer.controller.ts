import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailDto } from 'src/modules/email-consumer/dto/EmailDto';
import { EmailConsumerService } from 'src/modules/email-consumer/services/email-consumer.service';

@Controller()
export class EmailConsumerController {
  constructor(private readonly emailConsumerService: EmailConsumerService) {}

  @EventPattern('send-email')
  async sendEmail(@Payload() emailData: EmailDto) {
    await this.emailConsumerService.sendEmail(emailData);
  }
}
