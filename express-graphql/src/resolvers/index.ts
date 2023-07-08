import { NonEmptyArray } from "type-graphql";
import AuthResolver from "./auth.resolver";

// eslint-disable-next-line @typescript-eslint/ban-types
export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  AuthResolver,
];
