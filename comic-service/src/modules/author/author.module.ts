import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorModel, AuthorSchema } from './model/author';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthorModel.name, schema: AuthorSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AuthorModule {}
