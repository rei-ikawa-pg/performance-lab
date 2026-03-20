import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserMeasurements } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const measurements = await getUserMeasurements(session.user.email);
  return NextResponse.json(measurements);
}
