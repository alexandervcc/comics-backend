import { Module } from '@nestjs/common';
import AuthService from './services/auth.service';
import { ValidationModule } from '../validation/validation.module';
import { UserDao } from './dao/user.dao';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './schema/user';

@Module({
  imports: [
    ValidationModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [AuthService, UserDao],
})
export class AuthenticationModule {}