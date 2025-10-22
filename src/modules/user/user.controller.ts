import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiBearerAuth()
  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

}
