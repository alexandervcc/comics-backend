import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { ENV } from "../env";

@Service()
class JwtService {
  createJwtToken(payload: object, expiresIn: number) {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
  }
}

export default JwtService;
