export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface User {
  id: number;
  name: string;
  surname?: string;
  email: string;
  googleId?: string;
  avatar?: string;
  phone?: string;
  birthday?: string;
  gender?: UserGender;
  role: UserRole;
  isActive: boolean;
}
