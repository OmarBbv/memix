export enum UserType {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  CUSTOMER = 'customer',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface UserRole {
  id: number;
  name: string;
  permissions: string[];
  isActive: boolean;
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
  userType: UserType;
  isActive: boolean;
  role?: UserRole;
}
