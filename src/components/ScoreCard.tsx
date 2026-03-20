import { getMetricStatus, getStatusColor, formatMetricValue, METRIC_LABELS } from "@/lib/utils";
import type { CoreWebVitals } from "@/types/pagespeed";

interface ScoreCardProps {
  metrics: CoreWebVitals;
}

type MetricName = keyof CoreWebVitals;

const METRIC_KEYS: MetricName[] = ["lcp", "cls", "inp", "fcp", "ttfb"];

export function ScoreCard({ metrics }: ScoreCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {METRIC_KEYS.map((key) => {
        const value = metrics[key];
        const status = getMetricStatus(key, value);
        const color = getStatusColor(status);

        return (
          <div
            key={key}
            className="rounded-lg border border-border bg-card p-4 text-center"
            role="status"
            aria-label={`${METRIC_LABELS[key]}: ${formatMetricValue(key, value)}、状態: ${status}`}
          >
            <div className="text-xs font-medium uppercase text-muted-foreground">
              {key.toUpperCase()}
            </div>
            <div className="mt-1 text-2xl font-bold" style={{ color }}>
              {formatMetricValue(key, value)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{METRIC_LABELS[key]}</div>
          </div>
        );
      })}
    </div>
  );
}
