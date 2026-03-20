import { describe, it, expect, vi, beforeEach } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests within limit", () => {
    const result = rateLimit("test-user-1");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("blocks after 10 requests", () => {
    for (let i = 0; i < 10; i++) {
      rateLimit("test-user-2");
    }
    const result = rateLimit("test-user-2");
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after 1 hour", () => {
    for (let i = 0; i < 10; i++) {
      rateLimit("test-user-3");
    }
    expect(rateLimit("test-user-3").success).toBe(false);

    vi.advanceTimersByTime(60 * 60 * 1000 + 1);

    const result = rateLimit("test-user-3");
    expect(result.success).toBe(true);
  });

  it("isolates users", () => {
    for (let i = 0; i < 10; i++) {
      rateLimit("test-user-4");
    }
    const result = rateLimit("test-user-5");
    expect(result.success).toBe(true);
  });
});
