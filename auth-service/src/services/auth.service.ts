import { Service, Inject } from "typedi";

import KafkaProducer from "../config/kafka-producer";
import PasswordService from "./password.service";
import JwtService from "./jwt.service";

import UserModel from "./../model/User";

import { LoginUserDto, UserDto } from "../dto/UserDto";
import { TokenDto } from "../dto/TokenDto";
import { Result } from "../dto/ResultDto";

import { ResultStatus } from "../types/enums/Result";
import { User } from "../types/interfaces/User";

@Service()
class AuthService {
  constructor(
    @Inject() private kafkaProducer: KafkaProducer,
    @Inject() private passwordService: PasswordService,
    @Inject() private jwtService: JwtService
  ) {}

  async getUserById(_id: string): Promise<User | null> {
    return await UserModel.findById(_id);
  }

  async signUp(user: UserDto): Promise<Result> {
    const result: Result = {
      message: "User created.",
      result: ResultStatus.Success,
    };

    const userExists = await UserModel.find({
      $or: [{ email: user.email }, { username: user.username }],
    });

    if (userExists.length !== 0) {
      result.message = "Email/Username invalid, already in use.";
      result.result = ResultStatus.Error;
      return result;
    }

    const password = await this.passwordService.hashPassword(user.password);
    const newUser = new UserModel({
      ...user,
      password,
    });
    const validationErrors = newUser.validateSync();

    if (validationErrors) {
      result.message = `Invalid values.`;
      result.result = ResultStatus.Error;
      return result;
    }

    await newUser.save();

    return result;
  }

  async logIn(user: LoginUserDto): Promise<TokenDto> {
    const result: TokenDto = {
      message: "User Logged In",
      result: ResultStatus.Success,
    };

    const userFound = await UserModel.findOne<User>({
      username: user.username,
    });
    if (!userFound) {
      result.message = "User not found.";
      result.result = ResultStatus.Error;
      return result;
    }

    const validPassword = await this.passwordService.validatePassword(
      user.password,
      userFound.password
    );

    if (!validPassword) {
      result.message = "Invalid credentials.";
      result.result = ResultStatus.Error;
      return result;
    }

    result.token = this.jwtService.createJwtToken(userFound);

    return result;
  }
}

export default AuthService;
