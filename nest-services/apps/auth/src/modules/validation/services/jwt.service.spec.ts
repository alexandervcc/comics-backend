import { Test, TestingModule } from '@nestjs/testing';

import { decode, JsonWebTokenError, JwtPayload, sign } from 'jsonwebtoken';
import { mongo } from 'mongoose';

import JwtService from './jwt.service';
import { User } from '../../authentication/schema/user';
import { Times } from '../utils.ts/time';
import { TokenStatus } from '../types/token-status';
import { configuration } from '../../../config/configuration';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  decode: jest.fn(),
}));

describe('JwtService', () => {
  let service: JwtService;
  const mockUser: User = {
    _id: new mongo.ObjectId(),
    username: 'testuser',
    email: 'email@email.com',
    password: 'testpass',
  };
  const mockToken = 'mockToken';
  const mockConfiguration = {
    security: {
      jwtToken: 'mock-jwt',
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: configuration.KEY,
          useValue: mockConfiguration,
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  describe('createJwtToken()', () => {
    it('should generate a valid JWT token', () => {
      const signMock = jest.mocked(sign);
      signMock.mockReturnValue(mockToken as any);

      const result = service.createToken(mockUser, Times.Day);

      expect(result).toBe(mockToken);
      expect(signMock).toHaveBeenCalled();
    });
  });

  describe('isValidToken()', () => {
    it('should return TokenStatus.Valid for a valid token', () => {
      const token = 'validToken';

      const decodeValue: JwtPayload = {
        exp: currentHour() - 3600,
      };

      const decodeMock = jest.mocked(decode);
      decodeMock.mockReturnValue(decodeValue as any);

      const result = service.isValidToken(token);

      expect(result).toBe(TokenStatus.Valid);
      expect(decodeMock).toHaveBeenCalledWith(token);
    });

    it('should return TokenStatus.Expired for an expired token', () => {
      const token = 'expiredToken';
      const decodeValue: JwtPayload = {
        exp: currentHour() + 36000,
      };

      const decodeMock = jest.mocked(decode);
      decodeMock.mockReturnValue(decodeValue as any);

      const result = service.isValidToken(token);

      expect(result).toBe(TokenStatus.Expired);
      expect(decodeMock).toHaveBeenCalledWith(token);
    });

    it('should return TokenStatus.Invalid for an invalid token', () => {
      const token = 'invalidToken';

      const decodeMock = jest.mocked(decode);
      decodeMock.mockImplementation(() => {
        throw new JsonWebTokenError('Invalid token');
      });

      const result = service.isValidToken(token);

      expect(result).toBe(TokenStatus.Invalid);
      expect(decodeMock).toHaveBeenCalledWith(token);
    });
  });
});

const currentHour = () => Math.floor(Date.now() / 1000);
