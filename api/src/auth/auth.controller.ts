import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('send-otp')
  async sendOtp(@Body() body: { email: string; password: string; name: string; surname: string }) {
    return this.authService.sendRegistrationOtp(body);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; code: string }) {
    return this.authService.verifyOtpAndRegister(body.email, body.code);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { access_token } = await this.authService.login(req.user);
    res.redirect(
      `http://az.localhost:3000/auth/callback?token=${access_token}`,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }
}
