import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(KafkaProducerService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
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
