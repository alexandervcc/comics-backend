import { Module } from '@nestjs/common';
import AuthService from './services/auth.service';
import { ValidationModule } from '../validation/validation.module';
import { UserDao } from './dao/user.dao';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './schema/user';
import { KafkaModule } from '../kafka/kafka.module';
import { AuthenticationController } from './controllers/authentication.controller';

@Module({
  imports: [
    KafkaModule,
    ValidationModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthService, UserDao],
})
export class AuthenticationModule {}
