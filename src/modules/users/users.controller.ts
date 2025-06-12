import { SuccessResponseMessage } from '@common/decorators';
import { CurrentUser } from '@common/decorators/current-user';
import { Serialize } from '@common/interceptors';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { SerializeUserDto } from './dto/serialize-user.dto';
import { User } from './schema/user.schema';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(SerializeUserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @SuccessResponseMessage('User created successfully!')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        username: { type: 'string', example: 'johndoe' },
        email: { type: 'string', example: 'johndoe@example.com' },
        password: { type: 'string', example: '<yourpassword>' },
        confirmPassword: { type: 'string', example: '<yourpassword>' },
      },
    },
  })
  async createUser(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findUser(@CurrentUser() user: User) {
    return user;
  }
}
