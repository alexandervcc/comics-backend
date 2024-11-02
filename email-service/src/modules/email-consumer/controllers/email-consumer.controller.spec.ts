import { Test, TestingModule } from '@nestjs/testing';
import { EmailConsumerController } from './email-consumer.controller';

describe('EmailConsumerController', () => {
  let controller: EmailConsumerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailConsumerController],
    }).compile();

    controller = module.get<EmailConsumerController>(EmailConsumerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
