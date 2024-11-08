import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface AuthorData {
  name: string;
}

@Schema()
export class AuthorModel implements AuthorData {
  @Prop()
  name: string;
}

export const AuthorSchema = SchemaFactory.createForClass(AuthorModel);
