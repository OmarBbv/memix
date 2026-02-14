import { httpClientPublic, httpClientPrivate } from "@/lib/httpClient";
import { AuthServiceTypes, LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth.types";
import { User } from "@/lib/redux/features/authSlice";

class AuthService implements AuthServiceTypes {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await httpClientPublic.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClientPublic.post('/auth/register', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await httpClientPrivate.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: any): Promise<User> {
    const response = await httpClientPrivate.patch('/users/profile', data);
    return response.data;
  }
}

export const authService = new AuthService();
