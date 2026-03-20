import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchPageSpeedData } from "@/lib/pagespeed";
import { rateLimit } from "@/lib/rate-limit";
import { saveMeasurement } from "@/lib/supabase";
import { MeasureRequestSchema } from "@/types/pagespeed";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { success, remaining } = rateLimit(session.user.email);
  if (!success) {
    return NextResponse.json(
      { error: "リクエスト回数の上限に達しました。しばらくしてから再試行してください。" },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "無効なJSONです" }, { status: 400 });
  }

  const parsed = MeasureRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "無効なリクエストです", details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const result = await fetchPageSpeedData(parsed.data.url, parsed.data.strategy);
    // Supabaseに保存（レスポンスの返却をブロックしない）
    saveMeasurement(session.user.email, result, {}).catch(() => {});
    return NextResponse.json(result, {
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
