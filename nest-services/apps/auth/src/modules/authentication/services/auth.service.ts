import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import PasswordService from '../../validation/services/password.service';
import JwtService from '../../validation/services/jwt.service';
import { UserDao } from '../dao/user.dao';
import { ResultStatus } from '../types/result-status';
import { LoginUserDto, UserDto } from '../dto/UserDto';
import { Result } from '../dto/ResultDto';
import { Times } from '../../validation/utils.ts/time';
import { TokenDto } from '../dto/TokenDto';
import { KafkaProducerService } from '../../kafka/services/kafka-producer.service';
import { UserModel } from '../schema/user';
import { KafkaTopics } from '../../kafka/constants/topics';
import { configuration } from '../../../config/configuration';
import { ConfigType } from '@nestjs/config';
import { TokenStatus } from '../../validation/types/token-status';
import { mongo } from 'mongoose';

@Injectable()
class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private kafkaProducer: KafkaProducerService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private userDao: UserDao,
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
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

    const newUser = await this.userDao.createUser({
      ...user,
      password: hashedPassword,
      active: false,
    });

    await this.sendActivationCode(newUser);

    return {
      message:
        'User successfully created. Check your email to activate your user',
      result: ResultStatus.Success,
    };
  }

  async logIn(user: LoginUserDto): Promise<TokenDto> {
    const userFound = await this.userDao.findByUsername(user.username);

    if (userFound == null) {
      this.logger.log('User NOT found for provided credentials.', {
        usernamer: user.username,
      });
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
      this.logger.warn('Provided password does not belong to user.', user);
      throw new HttpException(
        'Password provided is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!userFound.active) {
      this.logger.log('User is not active, cannot use the system yet.');
      await this.sendActivationCode(userFound);
      throw new HttpException(
        'Need to activate the user first, check your email for a new activation code.',
        HttpStatus.FORBIDDEN,
      );
    }
    this.logger.log('User successfully logged into the system.');

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
    const { status, payload } =
      this.jwtService.isValidToken<Pick<UserModel, '_id'>>(activationCode);

    if (status !== TokenStatus.Valid) {
      this.logger.log('Invalid token, activation failed.', {
        reason: status,
      });
      throw new HttpException(
        'Invalid/Expired activation code, please log-in again to generate a new code.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userDao.activateUser(new mongo.ObjectId(payload._id));
    this.logger.log('User successfully actived.', { _id: payload._id });

    return {
      message: 'User successfully actived, you can start using the app.',
      result: ResultStatus.Success,
    };
  }

  private buildActivationUrl(user: UserModel): string {
    const code = this.jwtService.createToken({ _id: user._id }, Times.Hour);
    return `${this.config.url}/api/v1/activate?code=${code}`;
  }

  private async sendActivationCode(user: UserModel): Promise<void> {
    this.logger.log('Activation link email was sent to email service', {
      _id: user._id,
    });
    const activationUrl = this.buildActivationUrl(user);
    return this.kafkaProducer.sendMessage(KafkaTopics.SendEmail, {
      email: user.email,
      subject: 'Activation email',
      content: `Please click the next link to activate your account. <a href="${activationUrl}"> Here </a>`,
    });
  }
}

export default AuthService;
