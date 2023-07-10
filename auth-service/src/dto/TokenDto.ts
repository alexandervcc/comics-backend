import { Field, ObjectType } from "type-graphql";
import { ResultDto } from "./ResultDto";

@ObjectType()
export class TokenDto extends ResultDto {
  @Field(() => String, { nullable: true })
  token?: string;
}
