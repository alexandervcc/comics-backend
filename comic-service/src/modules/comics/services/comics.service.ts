import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ProducerService } from '../../kafka/producer/producer.service';
import { ConsumerService } from '../../kafka/consumer/consumer.service';
import KafkaTopics from 'src/constants/kafka-topics';
import { ComicDataDto } from '../dto/comic.dto';
import { ComicDao } from '../dao/comic.dao';
import { ComicData, ComicModel } from '../model/comic';
import { AuthorService } from 'src/modules/author/services/author.service';

@Injectable()
export class ComicsService implements OnModuleInit {
  private logger = new Logger(ComicsService.name);
  constructor(
    private kafkaProducer: ProducerService,
    private kafkaConsumer: ConsumerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly comicDao: ComicDao,
    private readonly authorService: AuthorService,
  ) {}

  async createNewComic(comic: ComicDataDto): Promise<ComicData> {
    this.logger.log('Creating comic', { comic });

    const authors = await Promise.all(
      comic.author.map((authorId: string) =>
        this.authorService.getAuthorById(authorId),
      ),
    );

    if (authors.find((a) => a == null)) {
      this.logger.log(
        'A provided authot does not exists, comic cannot be created.',
        { comic },
      );
      throw new HttpException('Invalid author.', HttpStatus.BAD_REQUEST);
    }

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

    return newComic;
  }

  async getComic(id: string): Promise<ComicDataDto> {
    const comic = await this.comicDao.getComic(id);
    if (comic == null) {
      this.logger.log('No comic was found', { id });
      throw new HttpException(
        'No comic found for the provided id.',
        HttpStatus.NOT_FOUND,
      );
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
