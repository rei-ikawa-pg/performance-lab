import { z } from "zod/v4";

export const MetricStatus = z.enum(["good", "needs-improvement", "poor"]);
export type MetricStatus = z.infer<typeof MetricStatus>;

export const MeasureRequestSchema = z.object({
  url: z.url(),
  strategy: z.enum(["mobile", "desktop"]).optional().default("mobile"),
});
export type MeasureRequest = z.infer<typeof MeasureRequestSchema>;

export const CoreWebVitalsSchema = z.object({
  lcp: z.number(),
  cls: z.number(),
  inp: z.number(),
  fcp: z.number(),
  ttfb: z.number(),
});
export type CoreWebVitals = z.infer<typeof CoreWebVitalsSchema>;

export interface Audit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string | undefined;
  details?: Record<string, unknown> | undefined;
}

export interface MeasureResult {
  id: string;
  url: string;
  strategy: "mobile" | "desktop";
  performanceScore: number;
  metrics: CoreWebVitals;
  audits: Audit[];
  fetchTime: string;
}

export const PageSpeedResponseSchema = z.object({
  lighthouseResult: z.object({
    categories: z.object({
      performance: z.object({
        score: z.number(),
      }),
    }),
    audits: z.record(
      z.string(),
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        score: z.number().nullable(),
        scoreDisplayMode: z.string(),
        displayValue: z.string().optional(),
        numericValue: z.number().optional(),
        details: z.record(z.string(), z.unknown()).optional(),
      }),
    ),
    fetchTime: z.string(),
  }),
});
export type PageSpeedResponse = z.infer<typeof PageSpeedResponseSchema>;
