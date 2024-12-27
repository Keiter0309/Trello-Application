import { rateLimitUtils } from "../utils/rateLimit.utils";

export class RateLimitMiddleWare {
  public static loginLimiter() {
    return rateLimitUtils(
      15,
      60,
      1000,
      5,
      "Too many requests, please try again later"
    );
  }

  public registerLimiter() {
    return rateLimitUtils(
      15,
      60,
      1000,
      5,
      "Too many requests, please try again later"
    );
  }

  public messageLimiter() {
    return rateLimitUtils(
      1,
      60,
      1000,
      10,
      "Don't spam, please try again later"
    );
  }

  public passwordResetLimiter() {
    return rateLimitUtils(
      15,
      60,
      1000,
      5,
      "Too many requests, please try again later"
    );
  }

  public verifyEmailLimiter() {
    return rateLimitUtils(
      15,
      60,
      1000,
      5,
      "Too many requests, please try again later"
    );
  }

  public changePasswordLimiter() {
    return rateLimitUtils(
      15,
      60,
      1000,
      5,
      "Too many requests, please try again later"
    );
  }

  public forgotPasswordLimiter() {
    return rateLimitUtils(
      15,
      60,
      1000,
      5,
      "Too many requests, please try again later"
    );
  }
}
