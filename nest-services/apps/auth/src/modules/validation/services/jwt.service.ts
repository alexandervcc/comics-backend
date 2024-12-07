import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { TokenStatus } from '../types/token-status';
import { currenHour } from '../utils.ts/time';
import { configuration } from '../../../config/configuration';
import { ConfigType } from '@nestjs/config';

@Injectable()
class JwtService {
  private logger = new Logger(JwtService.name);

  constructor(
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {}

  createToken(payload: object, expiresIn: number): string {
    return sign(payload, this.config.security.jwtSecret, {
      expiresIn,
    });
  }

  isValidToken<T extends JwtPayload>(
    token: string,
  ): { payload?: T; status: TokenStatus } {
    let decodedToken;
    try {
      decodedToken = verify(
        token,
        this.config.security.jwtSecret,
      ) as JwtPayload;
      const hour = currenHour();
      if (decodedToken.exp != null && decodedToken.exp < hour) {
        this.logger.log('Token is expired.', {
          expirationDate: decodedToken.exp,
          currentHour: hour,
        });
        return { status: TokenStatus.Expired };
      }
    } catch (error) {
      this.logger.warn('Invalid token.', { token });
      return { status: TokenStatus.Invalid };
    }
    this.logger.log('Token successfully decoded.', { decodedToken });
    return { status: TokenStatus.Valid, payload: decodedToken };
  }
}

export default JwtService;
