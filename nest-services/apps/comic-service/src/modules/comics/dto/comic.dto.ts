import { ObjectId } from 'mongoose';
import { ComicData } from '../model/comic';
import { ArrayNotEmpty, IsEmpty, IsIn, IsNotEmpty } from 'class-validator';

export class ComicDataDto implements ComicData {
  @IsEmpty()
  _id: ObjectId;

  @IsNotEmpty()
  name: string;

  // TODO: update list of valid genres
  @IsIn(['shonen'])
  @ArrayNotEmpty()
  genre: string[];

  @ArrayNotEmpty()
  author: string[];
}
