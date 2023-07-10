import JwtService from "./jwt.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../types/interfaces/User";
import { ENV } from "../env";
import { ObjectId } from "mongodb";
import { Times } from "../types/constants/times";
import { TokenStatus } from "../types/enums/TokenStatus";

jest.mock("jsonwebtoken");

describe("JwtService", () => {
  let jwtService: JwtService;
  const mockUser: User = {
    _id: new ObjectId(),
    username: "testuser",
    email: "email@email.com",
    password: "testpass",
  };
  const mockToken = "mockToken";

  beforeEach(() => {
    jwtService = new JwtService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createJwtToken()", () => {
    it("should generate a valid JWT token", () => {
      const signMock = jest
        .spyOn(jwt, "sign")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockReturnValue(mockToken as any);

      const result = jwtService.createToken(mockUser, Times.Day);

      expect(result).toBe(mockToken);
      expect(signMock).toHaveBeenCalledWith(mockUser, ENV.JWT_SECRET, {
        expiresIn: Times.Day,
      });
    });
  });

  describe("isValidToken()", () => {
    it("should return TokenStatus.Valid for a valid token", () => {
      const token = "validToken";

      const decodeValue: JwtPayload = {
        exp: currentHour() - 3600,
      };

      jest.spyOn(jwt, "decode").mockReturnValue(decodeValue as any);

      const result = jwtService.isValidToken(token);

      expect(result).toBe(TokenStatus.Valid);
      expect(jwt.decode).toHaveBeenCalledWith(token);
    });

    it("should return TokenStatus.Expired for an expired token", () => {
      const token = "expiredToken";
      const decodeValue: JwtPayload = {
        exp: currentHour() + 36000,
      };

      jest.spyOn(jwt, "decode").mockReturnValue(decodeValue as any);

      const result = jwtService.isValidToken(token);

      expect(result).toBe(TokenStatus.Expired);
      expect(jwt.decode).toHaveBeenCalledWith(token);
    });

    it("should return TokenStatus.Invalid for an invalid token", () => {
      const token = "invalidToken";

      jest.spyOn(jwt, "decode").mockImplementation(() => {
        throw new jwt.JsonWebTokenError("Invalid token");
      });

      const result = jwtService.isValidToken(token);

      expect(result).toBe(TokenStatus.Invalid);
      expect(jwt.decode).toHaveBeenCalledWith(token);
    });
  });
});

const currentHour = () => Math.floor(Date.now() / 1000);
