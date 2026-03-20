import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { MeasureResult } from "@/types/pagespeed";

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabaseの環境変数が設定されていません");
  }

  return createClient(url, key);
}

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase管理者用の環境変数が設定されていません");
  }

  return createClient(url, key);
}

export async function saveMeasurement(
  userId: string,
  result: MeasureResult,
  rawResponse: Record<string, unknown>,
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("measurements").insert({
    id: result.id,
    user_id: userId,
    url: result.url,
    strategy: result.strategy,
    performance_score: result.performanceScore,
    lcp: result.metrics.lcp,
    cls: result.metrics.cls,
    inp: result.metrics.inp,
    fcp: result.metrics.fcp,
    ttfb: result.metrics.ttfb,
    audits: result.audits,
    raw_response: rawResponse,
  });

  if (error) {
    console.error("計測データの保存に失敗しました:", error);
  }

  // 監視対象URLをupsert（既存なら更新、なければ挿入）
  await supabase
    .from("urls")
    .upsert(
      { user_id: userId, url: result.url, label: new URL(result.url).hostname },
      { onConflict: "user_id,url" },
    );
}

export async function getUserMeasurements(userId: string) {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("measurements")
    .select("id, url, strategy, performance_score, lcp, cls, inp, fcp, ttfb, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("計測データの取得に失敗しました:", error);
    return [];
  }

  return data ?? [];
}

export async function getUserUrls(userId: string) {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("URLの取得に失敗しました:", error);
    return [];
  }

  return data ?? [];
}
