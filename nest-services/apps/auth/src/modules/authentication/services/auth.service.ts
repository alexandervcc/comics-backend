import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import PasswordService from '../../validation/services/password.service';
import JwtService from '../../validation/services/jwt.service';
import { UserDao } from '../dao/user.dao';
import { ResultStatus } from '../types/result-status';
import { LoginUserDto, UserDto } from '../dto/UserDto';
import { Result } from '../dto/ResultDto';
import { Times } from '../../validation/utils.ts/time';
import { TokenDto } from '../dto/TokenDto';
import { KafkaProducerService } from '../../kafka/services/kafka-producer.service';

@Injectable()
class AuthService {
  constructor(
    private kafkaProducer: KafkaProducerService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private userDao: UserDao,
  ) {}

  async signUp(user: UserDto): Promise<Result> {
    const userExists = await this.userDao.checkExistingUser(
      user.email,
      user.username,
    );

    if (userExists) {
      throw new HttpException(
        'Email/Username invalid, already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.passwordService.hashPassword(
      user.password,
    );

    await this.userDao.createUser({
      ...user,
      password: hashedPassword,
      active: false,
    });

    await this.kafkaProducer.sendMessage('send.email', {
      email: user.email,
      subject: 'Activation email',
      // TODO: create URL and expose endpoint for activation
      content: 'Please click the next link to activate your account',
    });

    return {
      message:
        'User successfully created. Check your email to activate your user',
      result: ResultStatus.Success,
    };
  }

  async logIn(user: LoginUserDto): Promise<TokenDto> {
    const userFound = await this.userDao.findByUsername(user.username);

    if (userFound == null) {
      throw new HttpException(
        'User not found, some of your credentials is invalid.',
        HttpStatus.NOT_FOUND,
      );
    }

    const validPassword = await this.passwordService.validatePassword(
      user.password,
      userFound.password,
    );

    if (!validPassword) {
      throw new HttpException(
        'Password provided is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.createToken(
      {
        email: userFound.email,
        username: userFound.username,
      },
      Times.Day,
    );

    return {
      message: 'User Logged In',
      result: ResultStatus.Success,
      token,
    };
  }

  async activate(activationCode: string): Promise<Result> {
    // TODO: set timetout to the activation code
    const userFound = await this.userDao.activateUser(activationCode);

    if (!userFound) {
      throw new HttpException(
        'Invalid activation code.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'User successfully actived, you can start using the app.',
      result: ResultStatus.Success,
    };
  }
}

export default AuthService;
