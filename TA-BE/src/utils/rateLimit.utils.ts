import rateLimit from "express-rate-limit";

export const rateLimitUtils = (
  numberOfMinutes: number = 1,
  numberOfSeconds: number = 60,
  numberOfMiliseconds: number = 1000,
  max: number,
  message: string
) => {
  return rateLimit({
    windowMs: numberOfMinutes * numberOfSeconds * numberOfMiliseconds,
    max: max,
    message,
  });
};
