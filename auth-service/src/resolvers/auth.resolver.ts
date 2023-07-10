import { Resolver, Mutation, Args, Query, Arg } from "type-graphql";
import { LoginUserDto, User, UserDto } from "../dto/UserDto";
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

  @Query(() => User)
  async getUserData(@Arg("id") _id: string) {
    return this.authService.getUserById(_id);
  }

  @Query(() => TokenDto)
  async logIn(@Args() userLoginData: LoginUserDto) {
    return this.authService.logIn(userLoginData);
  }
}

export default AuthResolver;
