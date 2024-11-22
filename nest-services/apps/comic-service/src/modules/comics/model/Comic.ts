import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export interface ComicData {
  _id: ObjectId;
  name: string;
  genre: string[];
  author: string[];
}

@Schema({
  autoCreate: true,
  collection: 'comics',
})
export class ComicModel implements ComicData {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: [] })
  genre: string[];

  @Prop({ required: true, default: [] })
  author: string[];
}

export const ComicSchema = SchemaFactory.createForClass(ComicModel);
