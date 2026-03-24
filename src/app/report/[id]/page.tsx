"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ScoreCard } from "@/components/ScoreCard";
import { AuditList } from "@/components/AuditList";
import type { MeasureResult } from "@/types/pagespeed";

// D3.jsを含むGaugeChartを遅延ロードしバンドルサイズを削減
const GaugeChart = dynamic(
  () => import("@/components/charts/GaugeChart").then((mod) => ({ default: mod.GaugeChart })),
  {
    ssr: false,
    loading: () => <div className="h-[200px] w-[200px] animate-pulse rounded-full bg-muted" />,
  },
);

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const [result, setResult] = useState<MeasureResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`measure-${params.id}`);
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, [params.id]);

  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">レポートを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">パフォーマンスレポート</h1>
        <p className="text-sm text-muted-foreground">
          {result.url} — {result.strategy} — {new Date(result.fetchTime).toLocaleString()}
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <GaugeChart score={result.performanceScore} size={200} label="パフォーマンススコア" />
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">コアウェブバイタル</h2>
        <ScoreCard metrics={result.metrics} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">改善提案</h2>
        <AuditList audits={result.audits} />
      </section>
    </div>
  );
}
