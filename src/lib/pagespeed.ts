import "server-only";
import { PageSpeedResponseSchema, type MeasureResult, type Audit } from "@/types/pagespeed";

const PAGESPEED_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export async function fetchPageSpeedData(
  url: string,
  strategy: "mobile" | "desktop" = "mobile",
): Promise<MeasureResult> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    throw new Error("PAGESPEED_API_KEYが設定されていません");
  }

  const params = new URLSearchParams({
    url,
    strategy,
    category: "performance",
    locale: "ja",
    key: apiKey,
  });

  const response = await fetch(`${PAGESPEED_API_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`PageSpeed APIエラー: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();
  const parsed = PageSpeedResponseSchema.parse(raw);

  return normalizeResponse(parsed, url, strategy);
}

function normalizeResponse(
  data: ReturnType<typeof PageSpeedResponseSchema.parse>,
  url: string,
  strategy: "mobile" | "desktop",
): MeasureResult {
  const { lighthouseResult } = data;
  const { audits } = lighthouseResult;

  const metrics = {
    lcp: audits["largest-contentful-paint"]?.numericValue ?? 0,
    cls: audits["cumulative-layout-shift"]?.numericValue ?? 0,
    inp: audits["interaction-to-next-paint"]?.numericValue ?? 0,
    fcp: audits["first-contentful-paint"]?.numericValue ?? 0,
    ttfb: audits["server-response-time"]?.numericValue ?? 0,
  };

  const relevantAudits: Audit[] = Object.values(audits)
    .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== "notApplicable")
    .map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      score: a.score,
      scoreDisplayMode: a.scoreDisplayMode,
      displayValue: a.displayValue,
      details: a.details,
    }))
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1));

  return {
    id: crypto.randomUUID(),
    url,
    strategy,
    performanceScore: Math.round(lighthouseResult.categories.performance.score * 100),
    metrics,
    audits: relevantAudits,
    fetchTime: lighthouseResult.fetchTime,
  };
}
