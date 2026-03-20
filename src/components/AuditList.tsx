"use client";

import { useState } from "react";
import type { Audit } from "@/types/pagespeed";

interface AuditListProps {
  audits: Audit[];
}

export function AuditList({ audits }: AuditListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (audits.length === 0) {
    return <p className="text-sm text-muted-foreground">改善提案は見つかりませんでした。</p>;
  }

  return (
    <div className="space-y-2">
      {audits.map((audit) => {
        const isOpen = expanded.has(audit.id);
        const scoreColor =
          audit.score === null
            ? "#888"
            : audit.score >= 0.9
              ? "#0CCE6B"
              : audit.score >= 0.5
                ? "#FFA400"
                : "#FF4E42";

        return (
          <div key={audit.id} className="rounded-lg border border-border bg-card">
            <button
              onClick={() => toggle(audit.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: scoreColor }}
              >
                {audit.score !== null ? Math.round(audit.score * 100) : "–"}
              </span>
              <span className="flex-1 text-sm font-medium">{audit.title}</span>
              {audit.displayValue && (
                <span className="text-xs text-muted-foreground">{audit.displayValue}</span>
              )}
              <span className="text-muted-foreground">{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                {audit.description.replace(/\[.*?\]\(.*?\)/g, (match) => {
                  const text = match.match(/\[(.*?)\]/)?.[1] ?? "";
                  return text;
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
