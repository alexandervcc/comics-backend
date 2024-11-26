import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
class PasswordService {
  async hashPassword(cleanPassword: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);
    return hashedPassword;
  }

  async validatePassword(
    clearPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(clearPassword, hashedPassword);
  }
}

export default PasswordService;
