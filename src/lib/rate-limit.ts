const rateLimitMap = new Map<string, number[]>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10;

export function rateLimit(userId: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(userId) ?? [];

  const validTimestamps = timestamps.filter((t) => now - t < WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  validTimestamps.push(now);
  rateLimitMap.set(userId, validTimestamps);

  return { success: true, remaining: MAX_REQUESTS - validTimestamps.length };
}
