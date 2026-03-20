import Link from "next/link";
import { getScoreStatus, getStatusColor } from "@/lib/utils";

interface MeasurementRow {
  id: string;
  url: string;
  strategy: string;
  performance_score: number;
  lcp: number;
  cls: number;
  inp: number;
  fcp: number;
  ttfb: number;
  created_at: string;
}

interface UrlRow {
  id: string;
  url: string;
  label: string;
  created_at: string;
}

interface DashboardContentProps {
  measurements: MeasurementRow[];
  urls: UrlRow[];
}

export function DashboardContent({ measurements, urls }: DashboardContentProps) {
  if (measurements.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">まだ計測データがありません。</p>
        <Link href="/" className="mt-2 inline-block text-sm text-primary underline">
          最初の計測を実行する
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {urls.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">監視中のURL</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {urls.map((u) => {
              const latest = measurements.find((m) => m.url === u.url);
              const status = latest ? getScoreStatus(latest.performance_score) : null;
              const color = status ? getStatusColor(status) : undefined;

              return (
                <div key={u.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="text-sm font-medium truncate">{u.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.url}</div>
                  {latest && (
                    <div className="mt-2 text-2xl font-bold" style={{ color }}>
                      {latest.performance_score}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">最近の計測結果</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">URL</th>
                <th className="px-4 py-2 text-center font-medium">戦略</th>
                <th className="px-4 py-2 text-center font-medium">スコア</th>
                <th className="px-4 py-2 text-center font-medium">LCP</th>
                <th className="px-4 py-2 text-center font-medium">CLS</th>
                <th className="px-4 py-2 text-right font-medium">日付</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => {
                const status = getScoreStatus(m.performance_score);
                const color = getStatusColor(status);
                return (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="max-w-[200px] truncate px-4 py-2">
                      <Link href={`/report/${m.id}`} className="hover:underline">
                        {m.url}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {m.strategy === "mobile" ? "モバイル" : "デスクトップ"}
                    </td>
                    <td className="px-4 py-2 text-center font-bold" style={{ color }}>
                      {m.performance_score}
                    </td>
                    <td className="px-4 py-2 text-center">{Math.round(m.lcp)}ms</td>
                    <td className="px-4 py-2 text-center">{m.cls.toFixed(3)}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
