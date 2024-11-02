import { Injectable } from '@nestjs/common';
import { EmailDto } from 'src/modules/email-consumer/dto/EmailDto';

@Injectable()
export class EmailConsumerService {
  async sendEmail(emailData: EmailDto) {
    console.log('kafka data: ', emailData);
  }
}
