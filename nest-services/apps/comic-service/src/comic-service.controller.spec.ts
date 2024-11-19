import { Test, TestingModule } from '@nestjs/testing';
import { ComicServiceController } from './comic-service.controller';
import { ComicServiceService } from './comic-service.service';

describe('ComicServiceController', () => {
  let comicServiceController: ComicServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ComicServiceController],
      providers: [ComicServiceService],
    }).compile();

    comicServiceController = app.get<ComicServiceController>(ComicServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(comicServiceController.getHello()).toBe('Hello World!');
    });
  });
});
