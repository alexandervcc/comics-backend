import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import KafkaTopics from 'src/constants/kafka-topics';
import { ConsumerService } from 'src/modules/kafka/consumer/consumer.service';
import { ProducerService } from 'src/modules/kafka/producer/producer.service';

@Injectable()
export class ComicsService implements OnModuleInit {
  private logger = new Logger(ComicsService.name);
  constructor(
    private kafkaProducer: ProducerService,
    private kafkaConsumer: ConsumerService,
  ) {}

  async createNewComic(comic: { [key: string]: unknown }) {
    //Check DB
    this.logger.log(`Creating comic ${comic}`);

    await this.kafkaProducer.produce({
      topic: KafkaTopics.NewComic,
      messages: [
        {
          value:
            'Creating comic, once it has passed moderation. You will receive a new confirmation.',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.kafkaConsumer.consume(
      { topics: [KafkaTopics.NewChapter] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          this.logger.log(`Message consumed from topic ${topic} with payload: 
            value: ${message.value} partition: ${partition}
            `);
        },
      },
    );
  }

  async newChapterCreated() {}
}
