import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];

  constructor(private config: ConfigService) {
    this.kafka = new Kafka({
      brokers: [this.config.get<string>('KAFKA_BROKER')],
    });
  }

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'comics' });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);

    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
