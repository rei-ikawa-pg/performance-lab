import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MetricStatus } from "@/types/pagespeed";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MetricName = "lcp" | "cls" | "inp" | "fcp" | "ttfb";

const THRESHOLDS: Record<MetricName, [number, number]> = {
  lcp: [2500, 4000],
  cls: [0.1, 0.25],
  inp: [200, 500],
  fcp: [1800, 3000],
  ttfb: [800, 1800],
};

export function getMetricStatus(metric: MetricName, value: number): MetricStatus {
  const [good, ni] = THRESHOLDS[metric];
  if (value <= good) return "good";
  if (value <= ni) return "needs-improvement";
  return "poor";
}

const STATUS_COLORS: Record<MetricStatus, string> = {
  good: "#0CCE6B",
  "needs-improvement": "#FFA400",
  poor: "#FF4E42",
};

export function getStatusColor(status: MetricStatus): string {
  return STATUS_COLORS[status];
}

export function getScoreStatus(score: number): MetricStatus {
  if (score >= 90) return "good";
  if (score >= 50) return "needs-improvement";
  return "poor";
}

export function formatMetricValue(metric: MetricName, value: number): string {
  if (metric === "cls") return value.toFixed(3);
  if (value >= 1000) return `${(value / 1000).toFixed(1)}s`;
  return `${Math.round(value)}ms`;
}

export const METRIC_LABELS: Record<MetricName, string> = {
  lcp: "Largest Contentful Paint",
  cls: "Cumulative Layout Shift",
  inp: "Interaction to Next Paint",
  fcp: "First Contentful Paint",
  ttfb: "Time to First Byte",
};
