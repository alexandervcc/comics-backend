import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import AuthService from '../services/auth.service';
import { LoginUserDto, SignUpUserReq } from '../dto/UserDto';
import { Result } from '../dto/ResultDto';
import { Response } from 'express';
import { TokenDto } from '../dto/TokenDto';

@Controller('/api/v1/auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthService) {}

  @Post('/sign-up')
  public signUp(@Body() data: SignUpUserReq): Promise<Result> {
    return this.authenticationService.signUp(data);
  }

  @Post('/log-in')
  async logIn(
    @Res() res: Response,
    @Body() data: LoginUserDto,
  ): Promise<Response<TokenDto>> {
    const result = await this.authenticationService.logIn(data);

    res.setHeader('Authorization', `Bearer ${result.token}`);
    return res.json({
      result: result.result,
      message: result.message,
    });
  }

  @Get('/activate')
  activate(@Query('code') code: string): Promise<Result> {
    return this.authenticationService.activate(code);
  }
}
