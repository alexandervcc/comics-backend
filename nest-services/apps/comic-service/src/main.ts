import { NestFactory } from '@nestjs/core';
import { ComicServiceModule } from './comic-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ComicServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
