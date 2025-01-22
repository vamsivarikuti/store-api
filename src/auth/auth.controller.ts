import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SkipAuth } from './decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { Environment, EnvVars } from 'src/util/env.validator';
import { ConfigService } from '@nestjs/config';

@SkipAuth()
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() user: AuthDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const { access_token } = await this.authService.login(user);

    res.cookie('Authorization', access_token, {
      domain: req.host,
      httpOnly: true, // Make the cookie HTTPOnly
      // Set to true if using HTTPS
      secure:
        this.configService.getOrThrow(EnvVars.NODE_ENV) ===
        Environment.Production,
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // Set cookie expiration time (e.g., 7 days)
    });

    return { message: 'login successful' };
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
