import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { mongo } from 'mongoose';

export interface User {
  _id: mongo.ObjectId;
  username: string;
  password: string;
  email: string;
  active?: boolean;
  activationCode?: string;
}

@Schema({
  autoCreate: true,
  collection: 'users',
})
export class UserModel implements User {
  _id: mongo.BSON.ObjectId;

  @Prop({ required: true, type: String })
  username: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: false, type: Boolean, default: false })
  active?: boolean;

  @Prop({ required: false, type: String, default: null })
  activationCode?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
