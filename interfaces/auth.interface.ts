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
