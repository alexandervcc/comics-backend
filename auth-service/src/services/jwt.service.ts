import { Service } from "typedi";
import { User } from "../types/interfaces/User";
import jwt from "jsonwebtoken";
import { ENV } from "../env";

@Service()
class JwtService {
  constructor() {}

  createJwtToken(user: User) {
    const payload = { _id: user._id, username: user.username };
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "24h" });
  }
}

export default JwtService;
