import { mongo } from 'mongoose';
import { IsNotEmpty, IsNumber, Length, Min } from 'class-validator';
import { ChapterData } from '../model/chapter';

export class CreateChapterDto implements Omit<ChapterData, 'pages' | '_id'> {
  @IsNotEmpty()
  @Length(25, 100)
  description: string;

  @IsNotEmpty()
  @Length(3, 25)
  name: string;

  @IsNumber()
  @Min(1)
  episode: number;

  @IsNotEmpty()
  comic: mongo.ObjectId;
}
