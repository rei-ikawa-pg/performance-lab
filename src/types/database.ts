export interface Measurement {
  id: string;
  user_id: string;
  url: string;
  strategy: "mobile" | "desktop";
  performance_score: number;
  lcp: number;
  cls: number;
  inp: number;
  fcp: number;
  ttfb: number;
  audits: Record<string, unknown>;
  raw_response: Record<string, unknown>;
  created_at: string;
}

export interface MonitoredUrl {
  id: string;
  user_id: string;
  url: string;
  label: string;
  created_at: string;
}
