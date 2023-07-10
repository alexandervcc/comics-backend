import { Service } from "typedi";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { ENV } from "../env";
import { TokenStatus } from "../types/enums/TokenStatus";
import { currenHour } from "../utils/time";

@Service()
class JwtService {
  createToken(payload: object, expiresIn: number): string {
    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn,
    });
  }

  isValidToken(token: string): TokenStatus {
    try {
      const decodedToken = jwt.decode(token) as JwtPayload;
      if (decodedToken.exp!! > currenHour()) {
        return TokenStatus.Expired;
      }
    } catch (error) {
      return TokenStatus.Invalid;
    }
    return TokenStatus.Valid;
  }
}

export default JwtService;
