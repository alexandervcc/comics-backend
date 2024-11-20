import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorModel, AuthorSchema } from './model/author';
import { AuthorController } from './controllers/author.controller';
import { AuthorService } from './services/author.service';
import { AuthorDao } from './dao/author.dao';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthorModel.name, schema: AuthorSchema },
    ]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorDao],
  exports: [AuthorService],
})
export class AuthorModule {}
