export interface AuthResponse {
  statusCode: number;
  message: string;
  data: AuthData;
}

export interface AuthData {
  token: string;
  userId: number;
  email: string;
  role: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}
