import { Module } from '@nestjs/common';
import JwtService from './services/jwt.service';
import PasswordService from './services/password.service';

@Module({
  imports: [],
  controllers: [],
  providers: [JwtService, PasswordService],
  exports: [JwtService, PasswordService],
})
export class ValidationModule {}
