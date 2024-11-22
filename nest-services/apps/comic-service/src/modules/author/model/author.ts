import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export interface AuthorData {
  _id: ObjectId;
  name: string;
}

@Schema({
  autoCreate: true,
  collection: 'authors',
})
export class AuthorModel implements AuthorData {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;
}

export const AuthorSchema = SchemaFactory.createForClass(AuthorModel);
