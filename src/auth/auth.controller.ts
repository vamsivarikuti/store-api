import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SkipAuth } from './decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';

@SkipAuth()
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() user: AuthDto) {
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Req() req: Request) {
    const input: CreateUserDto = req.body;
    const user = await this.authService.signUp(input);
    return { user };
  }

  @Get('profile')
  profile(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    return req.logOut(console.error);
  }
}
