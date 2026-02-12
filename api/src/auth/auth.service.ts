import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateGoogleUser(details: {
    email: string;
    name: string;
    photo: string;
    googleId: string;
  }) {
    let user = await this.usersService.findByEmail(details.email);
    if (!user) {
      // Create new user
      const newUser = new User();
      newUser.email = details.email;
      newUser.name = details.name;
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
