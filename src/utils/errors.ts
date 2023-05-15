// Error Handling
// All Application Errors follow a specific pattern

// First Digit = 9;
// Digits 2 and 3 - Domain Page
// Digits 4 and 5 - Specific Error

// Pages
// 00 - Generic Errors

// 10 - Generic Auth Errors
// 11 - /signin
// 12 - /signout
// 13 - /api/auth/oauth

// 20 - /

// 30 - /predictions
// 31 - /predictions/:id

// When adding new errors, created an enum value first
export enum AppErrors {
  GENERIAL_UNKNOWN = "90000",
  AUTH_INVALID_CREDS = "91000",
  AUTH_INVALID_SIGNATURE = "91001",
}

// Then add a user friendly message
const errors: Record<AppErrors, string> = {
  "90000": "Unknown Error",
  "91000": "Invalid Credentials",
  "91001": "Invalid signature on your cookie. Try logging in again.",
};

export class AppError {
  public code: AppErrors;
  public message: string;
  public time: Date;

  constructor(code: AppErrors) {
    this.code = code;
    this.message = errors[code];
    this.time = new Date();
  }
}
