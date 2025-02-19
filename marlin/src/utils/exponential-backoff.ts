export class ExponentialBackoff {
  static async execute<T>(
    fn: () => Promise<T>,
    retries = 5,
    delay = 1000,
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((res) => setTimeout(res, delay * Math.pow(2, i)));
      }
    }
  }
}
