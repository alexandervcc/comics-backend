import { Injectable } from '@nestjs/common';
import { EmailDto } from 'src/model/EmailDto';

@Injectable()
export class EmailConsumerService {
    async sendEmail(emailData: EmailDto) {
        console.log("kafka data: ",emailData)
    }
}
