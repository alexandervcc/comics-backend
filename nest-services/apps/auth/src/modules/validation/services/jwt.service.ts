import { JwtPayload, sign, decode } from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { TokenStatus } from '../types/token-status';
import { currenHour } from '../utils.ts/time';
import { configuration } from '../../../config/configuration';
import { ConfigType } from '@nestjs/config';

@Injectable()
class JwtService {
  constructor(
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {}

  createToken(payload: object, expiresIn: number): string {
    return sign(payload, this.config.security.jwtSecret, {
      expiresIn,
    });
  }

  isValidToken(token: string): TokenStatus {
    try {
      const decodedToken = decode(token) as JwtPayload;
      if (decodedToken.exp != null && decodedToken.exp > currenHour()) {
        return TokenStatus.Expired;
      }
    } catch (error) {
      return TokenStatus.Invalid;
    }
    return TokenStatus.Valid;
  }
}

export default JwtService;
