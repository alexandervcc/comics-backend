import { AuthChecker } from "type-graphql";
//import Container from "typedi";
//import JwtService from "../services/jwt.service";
import { ExpressContext } from "apollo-server-express";

// TODO: still work to do
export const customAuthChecker: AuthChecker<ExpressContext> = ({ context }) => {
  //const jwtService = Container.get(JwtService);
 /*  const token = */ context.req.headers.authorization?.split("Bearer ");

  return true;
};
