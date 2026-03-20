"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GaugeChart } from "@/components/charts/GaugeChart";
import { ScoreCard } from "@/components/ScoreCard";
import { AuditList } from "@/components/AuditList";
import type { MeasureResult } from "@/types/pagespeed";

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
        <p className="text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Performance Report</h1>
        <p className="text-sm text-muted-foreground">
          {result.url} — {result.strategy} — {new Date(result.fetchTime).toLocaleString()}
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <GaugeChart score={result.performanceScore} size={200} label="Performance Score" />
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Core Web Vitals</h2>
        <ScoreCard metrics={result.metrics} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Improvement Suggestions</h2>
        <AuditList audits={result.audits} />
      </section>
    </div>
  );
}
