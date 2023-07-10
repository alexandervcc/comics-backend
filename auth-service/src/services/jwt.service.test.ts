import JwtService from "./jwt.service";
import jwt from "jsonwebtoken";
import { User } from "../types/interfaces/User";
import { ENV } from "../env";
import { ObjectId } from "mongodb";
import { Times } from "../types/constants/times";

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

      const result = jwtService.createJwtToken(mockUser, Times.Day);

      expect(result).toBe(mockToken);
      expect(signMock).toHaveBeenCalledWith(mockUser, ENV.JWT_SECRET, {
        expiresIn: Times.Day,
      });
    });
  });
});
