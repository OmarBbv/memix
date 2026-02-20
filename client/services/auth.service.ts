import { httpClientPublic, httpClientPrivate } from "@/lib/httpClient";
import { AuthServiceTypes, LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth.types";
import { User } from "@/lib/redux/features/authSlice";

class AuthService implements AuthServiceTypes {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClientPublic.post('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error("AuthService login error:", error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await httpClientPublic.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error("AuthService register error:", error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await httpClientPrivate.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error("AuthService getProfile error:", error);
      throw error;
    }
  }

  async updateProfile(data: any): Promise<User> {
    try {
      const response = await httpClientPrivate.patch('/users/profile', data);
      return response.data;
    } catch (error) {
      console.error("AuthService updateProfile error:", error);
      throw error;
    }
  }

  async sendOtp(data: { email: string; password: string; name: string; surname: string }) {
    try {
      const response = await httpClientPublic.post('/auth/send-otp', data);
      return response.data;
    } catch (error) {
      console.error("AuthService sendOtp error:", error);
      throw error;
    }
  }

  async verifyOtp(data: { email: string; code: string }) {
    try {
      const response = await httpClientPublic.post('/auth/verify-otp', data);
      return response.data;
    } catch (error) {
      console.error("AuthService verifyOtp error:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
