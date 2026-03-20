import { describe, it, expect } from "vitest";
import {
  getMetricStatus,
  getStatusColor,
  getScoreStatus,
  formatMetricValue,
} from "@/lib/utils";

describe("getMetricStatus", () => {
  it("returns good for LCP <= 2500", () => {
    expect(getMetricStatus("lcp", 2500)).toBe("good");
    expect(getMetricStatus("lcp", 1000)).toBe("good");
  });

  it("returns needs-improvement for LCP <= 4000", () => {
    expect(getMetricStatus("lcp", 2501)).toBe("needs-improvement");
    expect(getMetricStatus("lcp", 4000)).toBe("needs-improvement");
  });

  it("returns poor for LCP > 4000", () => {
    expect(getMetricStatus("lcp", 4001)).toBe("poor");
  });

  it("returns correct status for CLS", () => {
    expect(getMetricStatus("cls", 0.05)).toBe("good");
    expect(getMetricStatus("cls", 0.1)).toBe("good");
    expect(getMetricStatus("cls", 0.15)).toBe("needs-improvement");
    expect(getMetricStatus("cls", 0.25)).toBe("needs-improvement");
    expect(getMetricStatus("cls", 0.3)).toBe("poor");
  });

  it("returns correct status for INP", () => {
    expect(getMetricStatus("inp", 200)).toBe("good");
    expect(getMetricStatus("inp", 300)).toBe("needs-improvement");
    expect(getMetricStatus("inp", 501)).toBe("poor");
  });

  it("returns correct status for FCP", () => {
    expect(getMetricStatus("fcp", 1800)).toBe("good");
    expect(getMetricStatus("fcp", 2500)).toBe("needs-improvement");
    expect(getMetricStatus("fcp", 3001)).toBe("poor");
  });

  it("returns correct status for TTFB", () => {
    expect(getMetricStatus("ttfb", 800)).toBe("good");
    expect(getMetricStatus("ttfb", 1000)).toBe("needs-improvement");
    expect(getMetricStatus("ttfb", 1801)).toBe("poor");
  });
});

describe("getStatusColor", () => {
  it("returns correct colors", () => {
    expect(getStatusColor("good")).toBe("#0CCE6B");
    expect(getStatusColor("needs-improvement")).toBe("#FFA400");
    expect(getStatusColor("poor")).toBe("#FF4E42");
  });
});

describe("getScoreStatus", () => {
  it("returns good for score >= 90", () => {
    expect(getScoreStatus(90)).toBe("good");
    expect(getScoreStatus(100)).toBe("good");
  });

  it("returns needs-improvement for score >= 50", () => {
    expect(getScoreStatus(50)).toBe("needs-improvement");
    expect(getScoreStatus(89)).toBe("needs-improvement");
  });

  it("returns poor for score < 50", () => {
    expect(getScoreStatus(49)).toBe("poor");
    expect(getScoreStatus(0)).toBe("poor");
  });
});

describe("formatMetricValue", () => {
  it("formats CLS with 3 decimal places", () => {
    expect(formatMetricValue("cls", 0.123456)).toBe("0.123");
  });

  it("formats milliseconds", () => {
    expect(formatMetricValue("lcp", 500)).toBe("500ms");
  });

  it("formats seconds for values >= 1000", () => {
    expect(formatMetricValue("lcp", 2500)).toBe("2.5s");
  });
});
