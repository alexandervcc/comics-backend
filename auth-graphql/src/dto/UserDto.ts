import { Field, ArgsType, ObjectType, ID } from "type-graphql";
import { ObjectId } from "mongodb";
import { User as UserI } from "../types/interfaces/User";

@ArgsType()
@ObjectType()
export class LoginUserDto implements Omit<UserI, "_id" | "email"> {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
}

@ArgsType()
@ObjectType()
export class UserDto extends LoginUserDto {
  @Field(() => String)
  email!: string;
}

@ArgsType()
@ObjectType()
export class User implements Omit<UserI, "password"> {
  @Field(() => ID)
  _id!: ObjectId;

  @Field(() => String)
  username!: string;

  @Field(() => String)
  email!: string;
}
