import { Resolver, Mutation, Args, Query, Arg } from "type-graphql";
import { LoginUserDto, UserDto } from "../dto/UserDto";
import { Result, ResultDto } from "../dto/ResultDto";
import Container from "typedi";
import AuthService from "../services/auth.service";
import { TokenDto } from "../dto/TokenDto";

@Resolver()
class AuthResolver {
  private authService: AuthService;
  constructor() {
    this.authService = Container.get(AuthService);
  }

  @Mutation(() => ResultDto)
  async signUp(@Args() userDto: UserDto): Promise<Result> {
    return await this.authService.signUp(userDto);
  }

  @Query(() => TokenDto)
  async logIn(@Args() userLoginData: LoginUserDto): Promise<TokenDto> {
    return await this.authService.logIn(userLoginData);
  }

  @Query(() => ResultDto)
  async activate(
    @Arg("activationCode") activationCode: string
  ): Promise<ResultDto> {
    return await this.authService.activate(activationCode);
  }
}

export default AuthResolver;
