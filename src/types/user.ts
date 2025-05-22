export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}