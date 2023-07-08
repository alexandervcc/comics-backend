import "reflect-metadata";

import UserModel from "./../model/User";
import PasswordService from "./password.service";
import AuthService from "./auth.service";
import KafkaProducer from "../config/kafka-producer";
import JwtService from "./jwt.service";

import { Error } from "mongoose";
import { TokenDto } from "../dto/TokenDto";
import { Result } from "../dto/ResultDto";
import { LoginUserDto, UserDto } from "../dto/UserDto";
import { ResultStatus } from "../types/enums/Result";

//mocks
jest.mock("../config/kafka-producer", () => {
  return jest.fn().mockImplementation(() => ({
    sendMessageToBroke: jest.fn().mockResolvedValue(true),
  }));
});
jest.mock("./password.service", () => {
  return jest.fn().mockImplementation(() => ({
    hashPassword: jest.fn().mockResolvedValue("mockedHashedPassword"),
    validatePassword: jest.fn().mockResolvedValue(true),
  }));
});
jest.mock("./jwt.service", () => {
  return jest.fn().mockImplementation(() => ({
    createJwtToken: jest.fn().mockReturnValue("mockedToken"),
    validatePassword: jest.fn().mockReturnValue(true),
  }));
});

describe("AuthService", () => {
  let authService: AuthService;
  let passwordService: PasswordService;
  let jwtService: JwtService;

  beforeEach(() => {
    const kafkaProducer = new KafkaProducer();
    jwtService = new JwtService();
    passwordService = new PasswordService();
    authService = new AuthService(kafkaProducer, passwordService, jwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById()", () => {
    it("should return a user when a valid ID is provided", async () => {
      UserModel.findById = jest
        .fn()
        .mockResolvedValueOnce({ _id: "1", name: "John" });

      const user = await authService.getUserById("1");

      expect(user).toEqual({ _id: "1", name: "John" });
      expect(UserModel.findById).toHaveBeenCalledWith("1");
    });

    it("should return null when an invalid ID is provided", async () => {
      UserModel.findById = jest.fn().mockResolvedValueOnce(null);

      const user = await authService.getUserById("invalid-id");

      expect(user).toBeNull();
      expect(UserModel.findById).toHaveBeenCalledWith("invalid-id");
    });
  });

  describe("signUp()", () => {
    it("should create a new user and return a success result", async () => {
      UserModel.find = jest.fn().mockResolvedValueOnce([]);
      UserModel.prototype.save = jest.fn();

      const user: UserDto = {
        email: "test@example.com",
        username: "testuser",
        password: "password",
      };
      const result: Result = {
        message: "User created.",
        result: ResultStatus.Success,
      };

      const signUpResult = await authService.signUp(user);

      expect(UserModel.find).toHaveBeenCalledWith({
        $or: [{ email: user.email }, { username: user.username }],
      });
      expect(UserModel.prototype.save).toHaveBeenCalled();
      expect(signUpResult).toEqual(result);
    });

    it("should return an error result when email or username is already in use", async () => {
      // Create a mock implementation of UserModel.find
      UserModel.find = jest
        .fn()
        .mockResolvedValueOnce([{ email: "test@example.com" }]);

      const user: UserDto = {
        email: "test@example.com",
        username: "testuser",
        password: "password",
      };
      const result: Result = {
        message: "Email/Username invalid, already in use.",
        result: ResultStatus.Error,
      };

      const signUpResult = await authService.signUp(user);

      expect(UserModel.find).toHaveBeenCalledWith({
        $or: [{ email: user.email }, { username: user.username }],
      });
      expect(signUpResult).toEqual(result);
    });

    it("should return an error result when validation fails", async () => {
      // Create a mock implementation of UserModel.find
      UserModel.find = jest.fn().mockResolvedValueOnce([]);
      UserModel.prototype.save = jest.fn();

      const user: UserDto = {
        email: "test@example.com",
        username: "testuser",
        password: "password",
      };
      const result: Result = {
        message: "Invalid values.",
        result: ResultStatus.Error,
      };

      // Simulate validation errors
      UserModel.prototype.validateSync = jest
        .fn()
        .mockReturnValueOnce(new Error.ValidationError());

      const signUpResult = await authService.signUp(user);

      expect(UserModel.find).toHaveBeenCalledWith({
        $or: [{ email: user.email }, { username: user.username }],
      });
      expect(UserModel.prototype.save).not.toHaveBeenCalled();
      expect(UserModel.prototype.validateSync).toHaveBeenCalled();
      expect(signUpResult).toEqual(result);
    });
  });

  describe("logIn()", () => {
    it("should log in a user with valid credentials and return a token", async () => {
      const dbUser = {
        username: "testuser",
        password: "hashedpassword",
      };
      const generatedToken = "mockedtoken";
      UserModel.findOne = jest.fn().mockResolvedValueOnce(dbUser);
      passwordService.validatePassword = jest.fn().mockReturnValueOnce(true);
      jwtService.createJwtToken = jest.fn().mockReturnValue(generatedToken);

      const user: LoginUserDto = {
        username: "testuser",
        password: "password",
      };

      const result: TokenDto = {
        message: "User Logged In",
        result: ResultStatus.Success,
        token: generatedToken,
      };

      const loginResult: TokenDto = await authService.logIn(user);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        username: user.username,
      });
      expect(passwordService.validatePassword).toHaveBeenCalledWith(
        user.password,
        "hashedpassword"
      );
      expect(jwtService.createJwtToken).toHaveBeenCalledWith(dbUser);
      expect(loginResult).toEqual(result);
    });

    it("should return an error result for an invalid username", async () => {
      UserModel.findOne = jest.fn().mockResolvedValueOnce(null);

      const user: LoginUserDto = {
        username: "invaliduser",
        password: "password",
      };

      const result: TokenDto = {
        message: "User not found.",
        result: ResultStatus.Error,
      };

      const loginResult: TokenDto = await authService.logIn(user);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        username: user.username,
      });
      expect(passwordService.validatePassword).not.toHaveBeenCalled(); // Use passwordService mock
      expect(loginResult).toEqual(result);
    });

    it("should return an error result for an invalid password", async () => {
      UserModel.findOne = jest.fn().mockResolvedValueOnce({
        username: "testuser",
        password: "hashedpassword",
      });

      passwordService.validatePassword = jest.fn().mockReturnValueOnce(false);

      const user: LoginUserDto = {
        username: "testuser",
        password: "invalidpassword",
      };

      const result: TokenDto = {
        message: "Invalid credentials.",
        result: ResultStatus.Error,
      };

      const loginResult: TokenDto = await authService.logIn(user);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        username: user.username,
      });
      expect(passwordService.validatePassword).toHaveBeenCalledWith(
        user.password,
        "hashedpassword"
      );
      expect(loginResult).toEqual(result);
    });
  });
});
