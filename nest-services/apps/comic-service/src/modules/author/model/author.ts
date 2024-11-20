import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export interface AuthorData {
  _id: ObjectId;
  name: string;
}

@Schema()
export class AuthorModel implements AuthorData {
  _id: ObjectId;

  @Prop()
  name: string;
}

export const AuthorSchema = SchemaFactory.createForClass(AuthorModel);
