import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import KafkaTopics from '../constants/kafka-topics';
import { ConsumerService } from '../modules/kafka/consumer/consumer.service';
import { ProducerService } from '../modules/kafka/producer/producer.service';

@Injectable()
export class ComicsService implements OnModuleInit {
  private logger = new Logger(ComicsService.name);
  constructor(
    private kafkaProducer: ProducerService,
    private kafkaConsumer: ConsumerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createNewComic(comic: { [key: string]: unknown }) {
    //Check DB
    this.logger.log(`Creating comic ${comic}`);
    const idNewComic = JSON.stringify(comic);
    await this.cacheManager.set(idNewComic, comic);
    const cachedComic = await this.cacheManager.get(idNewComic);
    if (cachedComic) {
      this.logger.debug(
        `Cached value retrieved: ${JSON.stringify(cachedComic)}`,
      );
    }

    await this.kafkaProducer.produce({
      topic: KafkaTopics.NewComic,
      messages: [
        {
          value: `Creating comic, once it has passed moderation. You will receive a new confirmation. ${JSON.stringify(
            comic,
          )}`,
        },
      ],
    });
  }

  async onModuleInit() {
    await this.kafkaConsumer.consume(
      { topics: [KafkaTopics.NewChapter, KafkaTopics.NewComic] },
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
