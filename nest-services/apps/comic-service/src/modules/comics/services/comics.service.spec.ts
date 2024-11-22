import { Test, TestingModule } from '@nestjs/testing';
import { ComicsService } from './comics.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConsumerService } from '../../kafka/consumer/consumer.service';
import { ProducerService } from '../../kafka/producer/producer.service';
import { KafkaModule } from 'src/modules/kafka/kafka.module';

describe('ComicsService', () => {
  let service: ComicsService;

  const mockCacheManager = {
    set: jest.fn(),
    del: jest.fn(),
    get: jest.fn(),
    reset: jest.fn(),
  };

  const mockConsumerService = {
    consume: jest.fn(),
    onApplicationShutdown: jest.fn(),
  };
  const mockProducerService = {
    produce: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule],
      providers: [
        ComicsService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: ConsumerService, useValue: mockConsumerService },
        { provide: ProducerService, useValue: mockProducerService },
      ],
    }).compile();

    service = module.get<ComicsService>(ComicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
