import { Result } from "../../dto/ResultDto";
import { User, UserDto } from "../../dto/UserDto";

export interface AuthServiceI {
  signUp(user: UserDto): Promise<Result>;
  getUserById(_id: string): Promise<User | null>;
}
