import { httpClient } from "@/lib/httpClient";

export class AuthService {
  static async login(data: any) {
    const response = await httpClient.post('/auth/login', data);
    return response.data;
  }

  static async register(data: any) {
    const response = await httpClient.post('/auth/register', data);
    return response.data;
  }

  static async getProfile(token: string) {
    const response = await httpClient.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}
