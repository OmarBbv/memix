import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

interface OtpEntry {
  code: string;
  data: any;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private otpStore = new Map<string, OtpEntry>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendRegistrationOtp(registerData: {
    email: string;
    password: string;
    name: string;
    surname: string;
  }) {
    // Check if email already exists
    const existing = await this.usersService.findByEmail(registerData.email);
    if (existing) {
      throw new BadRequestException('Bu email artıq istifadə olunur.');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    this.otpStore.set(registerData.email, {
      code,
      data: registerData,
      expiresAt,
    });

    await this.mailService.sendOtpEmail(
      registerData.email,
      code,
      registerData.name,
    );

    return { message: 'OTP kodu emailinizə göndərildi.' };
  }

  async verifyOtpAndRegister(email: string, code: string) {
    const entry = this.otpStore.get(email);

    if (!entry) {
      throw new BadRequestException('OTP kodu tapılmadı. Yenidən cəhd edin.');
    }

    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(email);
      throw new BadRequestException(
        'OTP kodunun vaxtı bitib. Yenidən cəhd edin.',
      );
    }

    if (entry.code !== code) {
      throw new BadRequestException('OTP kodu yanlışdır.');
    }

    this.otpStore.delete(email);

    // Complete registration
    const user = await this.usersService.create(entry.data);
    return user;
  }

  async validateGoogleUser(details: {
    email: string;
    name: string;
    surname?: string;
    photo: string;
    googleId: string;
  }) {
    let user = await this.usersService.findByEmail(details.email);
    if (!user) {
      // Create new user
      const newUser = new User();
      newUser.email = details.email;
      newUser.name = details.name;
      newUser.surname = details.surname || '';
      newUser.googleId = details.googleId;
      newUser.avatar = details.photo;
      // No password for google user
      user = await this.usersService.create(newUser);
    } else if (!user.googleId) {
      // Link google account to existing user
      // This part would typically require updating the user, but for now let's just use the existing user
      // We might want to update the googleId if it's missing
      // TODO: Update user with googleId if we had an update method
    }
    return user;
  }
}
