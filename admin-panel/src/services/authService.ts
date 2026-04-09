import axiosInstance from "../api/axiosInstance";
import { User } from "../types/user";

export interface LoginResponse {
  access_token: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface IAuthService {
  login(data: LoginDto): Promise<LoginResponse>;
  getProfile(): Promise<User>;
}

class AuthService implements IAuthService {
  async login(data: LoginDto): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Daxil olarkən xəta baş verdi");
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>("/auth/profile");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Profil məlumatlarını alarkən xəta baş verdi");
    }
  }
}

export const authService = new AuthService();
