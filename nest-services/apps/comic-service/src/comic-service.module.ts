import { Module } from '@nestjs/common';
import { ComicServiceController } from './comic-service.controller';
import { ComicServiceService } from './comic-service.service';

@Module({
  imports: [],
  controllers: [ComicServiceController],
  providers: [ComicServiceService],
})
export class ComicServiceModule {}
