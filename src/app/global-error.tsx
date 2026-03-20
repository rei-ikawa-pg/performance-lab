"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <html lang="ja">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <h2>エラーが発生しました</h2>
          <p>アプリケーションで問題が発生しました。</p>
          <button onClick={reset}>再試行</button>
        </div>
      </body>
    </html>
  );
}
