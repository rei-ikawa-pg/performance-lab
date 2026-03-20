"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { MeasureResult } from "@/types/pagespeed";

async function measureUrl(url: string, strategy: "mobile" | "desktop"): Promise<MeasureResult> {
  const res = await fetch("/api/measure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, strategy }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

export function MeasureForm() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => measureUrl(url, strategy),
    onSuccess: (data) => {
      // Store result in sessionStorage for the report page
      sessionStorage.setItem(`measure-${data.id}`, JSON.stringify(data));
      router.push(`/report/${data.id}`);
    },
  });

  const isValidUrl = (() => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  })();

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={mutation.isPending}
          aria-label="URL to measure"
        />
        <Button
          onClick={() => mutation.mutate()}
          disabled={!isValidUrl || mutation.isPending}
        >
          {mutation.isPending ? "Measuring..." : "Measure"}
        </Button>
      </div>

      <div className="flex gap-2">
        {(["mobile", "desktop"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              strategy === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {mutation.isPending && (
        <div className="text-center text-sm text-muted-foreground">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          Analyzing performance... This may take 10-30 seconds.
        </div>
      )}

      {mutation.isError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {mutation.error.message}
        </div>
      )}
    </div>
  );
}
