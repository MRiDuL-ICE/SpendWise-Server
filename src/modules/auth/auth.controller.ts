import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from "./dto/login-user.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  registerUser(@Body() registerUser: RegisterUserDto) {
    return this.authService.registerUser(registerUser);
  }

  @Post('login')
  loginUser(@Body() loginUser: LoginUserDto) {
    return this.authService.loginUser(loginUser);
  }
}