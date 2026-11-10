export interface AuthResult {
  success: boolean;
  user?: object;
  token?: string;
  refreshToken?: string;
  errorCode?: string;
  errorMessage?: string;
}
