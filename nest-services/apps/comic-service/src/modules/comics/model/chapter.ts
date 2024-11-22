import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { mongo } from 'mongoose';

export interface ChapterData {
  _id: mongo.ObjectId;
  name: string;
  episode: number;
  pages: string[];
  comic: mongo.ObjectId;
  description: string;
}

@Schema({
  autoCreate: true,
  collection: 'chapters',
})
export class ChapterModel implements ChapterData {
  _id: mongo.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  episode: number;

  @Prop({ required: true })
  pages: string[];

  @Prop({ required: true, type: mongo.ObjectId })
  comic: mongo.ObjectId;
}

export const ChapterSchema = SchemaFactory.createForClass(ChapterModel);

ChapterSchema.index(
  { comic: 1, episode: 1 },
  { unique: true, name: 'unique_episode_by_comic' },
);
