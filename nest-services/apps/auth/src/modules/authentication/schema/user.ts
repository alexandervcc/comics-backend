import { mongo } from 'mongoose';

export interface User {
  _id: mongo.ObjectId;
  username: string;
  password: string;
  email: string;
}
