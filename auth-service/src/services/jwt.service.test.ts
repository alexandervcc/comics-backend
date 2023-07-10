import JwtService from "./jwt.service";
import jwt from "jsonwebtoken";
import { User } from "../types/interfaces/User";
import { ENV } from "../env";
import { ObjectId } from "mongodb";

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
        .mockReturnValue(mockToken as any);

      const result = jwtService.createJwtToken(mockUser);

      expect(result).toBe(mockToken);
      expect(signMock).toHaveBeenCalledWith(
        { _id: mockUser._id, username: mockUser.username },
        ENV.JWT_SECRET,
        { expiresIn: "24h" }
      );
    });
  });
});
