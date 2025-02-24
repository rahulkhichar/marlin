export interface RateLimiter {
  isRateLimited(userId: string): Promise<boolean>;
}
