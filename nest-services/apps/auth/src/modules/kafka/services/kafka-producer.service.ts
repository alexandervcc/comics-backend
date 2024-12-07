import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Services } from 'apps/auth/src/constants/services';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(KafkaProducerService.name);

  constructor(
    @Inject(Services.KafkaService) private readonly kafkaClient: ClientKafka,
  ) {}

  async sendMessage(
    topic: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    await this.kafkaClient.emit<string, object>(topic, payload).toPromise();
    this.logger.log('Message sent.', { topic, payload });
  }

  onModuleInit() {
    this.kafkaClient.connect();
  }

  onModuleDestroy() {
    this.kafkaClient.close();
  }
}
