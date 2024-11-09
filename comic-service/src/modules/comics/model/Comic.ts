import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export interface ComicData {
  _id: ObjectId;
  name: string;
  genre: string[];
  author: string[];
}

@Schema()
export class ComicModel implements ComicData {
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  genre: string[];

  @Prop()
  author: string[];
}

export const ComicSchema = SchemaFactory.createForClass(ComicModel);
