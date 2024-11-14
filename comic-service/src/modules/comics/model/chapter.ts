import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export interface ChapterData {
  _id: ObjectId;
  name: string;
  episode: number;
  pages: string[];
  comic: ObjectId;
  description: string;
}

@Schema()
export class ChapterModel implements ChapterData {
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  episode: number;

  @Prop()
  pages: string[];

  @Prop()
  comic: ObjectId;
}

export const ChapterSchema = SchemaFactory.createForClass(ChapterModel);
