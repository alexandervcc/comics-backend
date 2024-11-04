import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface ComicData {
  name: string;
  genre: string[];
  author: string[];
}

@Schema()
export class ComicModel implements ComicData {
  @Prop()
  name: string;

  @Prop()
  genre: string[];

  @Prop()
  author: string[];
}

export const ComicSchema = SchemaFactory.createForClass(ComicModel);
