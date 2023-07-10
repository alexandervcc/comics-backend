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
import { Times } from "../types/constants/times";
import { ObjectId } from "mongodb";

@Service()
class AuthService {
  constructor(
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
    const activationCode = this.jwtService.createJwtToken(
      { _id: new ObjectId().toString() },
      Times.Hour
    );
    const newUser = new UserModel({
      ...user,
      password,
      activationCode,
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

    const payload: object = {
      email: userFound.email,
    };
    result.token = this.jwtService.createJwtToken(payload, Times.Day);

    return result;
  }

  async activate(activationCode: string): Promise<Result> {
    const result: Result = {
      message: "User activated.",
      result: ResultStatus.Success,
    };

    const userFound = await UserModel.findOne<User>({ activationCode }).exec();

    if (!userFound) {
      result.result = ResultStatus.Error;
      result.message = "Invalid link.";
    }

    const userUpdated = await UserModel.updateOne(
      { _id: userFound?._id },
      { activated: true, activationCode: null }
    );

    if (!userUpdated.acknowledged) {
      result.result = ResultStatus.Error;
      result.message = "Error, try again later.";
    }
    return result;
  }
}

export default AuthService;
