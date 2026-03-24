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
  lcp: "最大コンテンツ描画",
  cls: "レイアウトのずれ",
  inp: "操作の応答速度",
  fcp: "最初のコンテンツ描画",
  ttfb: "サーバー応答時間",
};

const STATUS_LABELS: Record<MetricStatus, string> = {
  good: "良好",
  "needs-improvement": "改善が必要",
  poor: "不良",
};

export function getStatusLabel(status: MetricStatus): string {
  return STATUS_LABELS[status];
}

export function formatThreshold(metric: MetricName): string {
  const [good] = THRESHOLDS[metric];
  if (metric === "cls") return `≤ ${good}`;
  if (good >= 1000) return `≤ ${good / 1000}s`;
  return `≤ ${good}ms`;
}
