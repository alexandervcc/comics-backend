import { Service } from "typedi";
import { User } from "../types/interfaces/User";
import jwt from "jsonwebtoken";
import { ENV } from "../env";

@Service()
class JwtService {
  private readonly secret: string;

  constructor() {
    this.secret = ENV.SECRET;
  }

  createJwtToken(user: User) {
    const payload = { _id: user._id, username: user.username };
    return jwt.sign(payload, this.secret, { expiresIn: "24h" });
  }
}

export default JwtService;
