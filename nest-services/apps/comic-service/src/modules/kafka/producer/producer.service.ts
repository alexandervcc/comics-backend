import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { configuration } from 'apps/comic-service/src/config/configuration';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private kafka: Kafka;
  private producer: Producer;

  constructor(
    @Inject(configuration.KEY)
    private config: ConfigType<typeof configuration>,
  ) {}

  async onModuleInit() {
    this.kafka = new Kafka({
      brokers: [this.config.kafka.broker],
    });
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onApplicationShutdown(signal?: string) {
    await this.producer.disconnect();
  }
}
