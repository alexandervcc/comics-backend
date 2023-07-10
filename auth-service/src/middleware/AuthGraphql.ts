import { AuthChecker } from "type-graphql";
import Container from "typedi";
import JwtService from "../services/jwt.service";
import { ExpressContext } from "apollo-server-express";

export const customAuthChecker: AuthChecker<ExpressContext> = (
  { root, args, context, info },
  roles
) => {
  const jwtService = Container.get(JwtService);
  const token = context.req.headers.authorization?.split("Bearer ");
  console.log("token: ", token);

  return true;
};
