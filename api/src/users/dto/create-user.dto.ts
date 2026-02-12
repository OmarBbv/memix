export class CreateUserDto {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  surname?: string;
}
