import { Field, ObjectType } from "type-graphql";
import { ResultStatus } from "../types/enums/Result";

export interface Result {
  result: string;
  message: string;
}

@ObjectType()
export class ResultDto implements Result {
  @Field(() => String)
  result!: ResultStatus;

  @Field(() => String)
  message!: string;
}
