"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <h2 className="mb-2 text-2xl font-bold">エラーが発生しました</h2>
      <p className="mb-4 text-muted-foreground">
        予期しないエラーが発生しました。再試行してください。
      </p>
      <Button onClick={reset}>再試行</Button>
    </div>
  );
}
