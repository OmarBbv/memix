import { User } from '@/lib/redux/features/authSlice';

export interface LoginRequest {
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  name?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  name: string;
  surname?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthServiceTypes {
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  getProfile: () => Promise<User>;
}
