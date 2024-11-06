import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ProducerService } from '../../kafka/producer/producer.service';
import { ConsumerService } from '../../kafka/consumer/consumer.service';
import KafkaTopics from 'src/constants/kafka-topics';
import { ComicDataDto } from '../dto/ComicData';
import { ComicDao } from '../dao/comic.dao';
import { ComicModel } from '../model/Comic';

@Injectable()
export class ComicsService implements OnModuleInit {
  private logger = new Logger(ComicsService.name);
  constructor(
    private kafkaProducer: ProducerService,
    private kafkaConsumer: ConsumerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly comicDao: ComicDao,
  ) {}

  async createNewComic(comic: ComicDataDto) {
    this.logger.log('Creating comic', { comic });

    // Save into DB, use mongoose
    const newComic = await this.comicDao.createComic(comic);

    await this.cacheManager.set(newComic._id.toString(), comic);

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
    const comic = await this.comicDao.getComic(id);
    if (comic == null) {
      this.logger.log('No comic was found', { id });
      return null;
    }
    return comic;
  }

  async updateComic(id: string, comicData: ComicDataDto): Promise<ComicModel> {
    const comic = await this.getComic(id);
    if (comic == null) {
      return null;
    }
    const cleanUpdate = Object.keys(comicData).reduce((prev, key) => {
      if (comic[key] == null) {
        return prev;
      }
      return {
        ...prev,
        key: comic[key],
      };
    }, {}) as ComicDataDto;
    if (Object.keys(cleanUpdate).length === 0) {
      this.logger.error('No defined attributes were passed to update comic.');
      return null;
    }
    return this.comicDao.updateComic(id, cleanUpdate);
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
