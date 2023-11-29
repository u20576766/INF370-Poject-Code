export interface SendTwoFactorTokenViewModel {
    email: string;
    appBaseUrl: string;
  }

  export interface VerifyTwoFactorTokenViewModel {
    userId: string;
    token: string;
  }
  