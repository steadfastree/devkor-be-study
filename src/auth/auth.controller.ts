import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register() {}

  @Post('login')
  async login() {}

  @Get('logout')
  async logout() {}

  @Post('password') //Put?
  async password() {}

  @Get('withdrawal')
  async withdrawal() {}
}
