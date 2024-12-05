import { mongo } from 'mongoose';
import { User as UserI } from '../schema/user';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto implements Pick<UserI, 'username' | 'password'> {
  @IsNotEmpty()
  @MinLength(5)
  username!: string;

  @IsNotEmpty()
  @MinLength(8)
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

export class SignUpUserReq implements Omit<UserI, '_id'> {
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
