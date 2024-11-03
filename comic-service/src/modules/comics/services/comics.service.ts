import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ProducerService } from '../../kafka/producer/producer.service';
import { ConsumerService } from '../../kafka/consumer/consumer.service';
import KafkaTopics from 'src/constants/kafka-topics';
import { ComicDataDto } from '../dto/ComicData';

@Injectable()
export class ComicsService implements OnModuleInit {
  private logger = new Logger(ComicsService.name);
  constructor(
    private kafkaProducer: ProducerService,
    private kafkaConsumer: ConsumerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createNewComic(comic: ComicDataDto) {
    this.logger.log('Creating comic', { comic });

    const idNewComic = JSON.stringify(comic);

    await this.cacheManager.set(idNewComic, comic);

    // Save into DB, use mongoose

    // Move this logic into an emailer service
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

  async getComic(id: string): Promise<ComicDataDto> {
    throw new Error('Method not implemented.');
  }

  async onModuleInit() {
    await this.kafkaConsumer.consume(
      // TODO: Check what & when to consume a topic
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
}
