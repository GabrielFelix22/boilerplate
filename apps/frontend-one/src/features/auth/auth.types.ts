export interface ILoginRequest {
  email: string;
  // password: string;
  remember: boolean;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  checkPassword: string;
};
