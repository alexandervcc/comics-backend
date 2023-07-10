import { Service } from "typedi";
import { User } from "../types/interfaces/User";
import jwt from "jsonwebtoken";
import { ENV } from "../env";

@Service()
class JwtService {
  constructor() {}

  createJwtToken(payload: object, expiresIn: number) {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
  }
}

export default JwtService;
