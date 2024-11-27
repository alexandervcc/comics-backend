import { mongo } from 'mongoose';
import { User as UserI } from '../schema/user';

export class LoginUserDto implements Pick<UserI, 'username' | 'password'> {
  username!: string;

  password!: string;
}

export class UserDto extends LoginUserDto {
  email!: string;
}

export class User implements Omit<UserI, 'password'> {
  _id!: mongo.ObjectId;

  username!: string;

  email!: string;
}
