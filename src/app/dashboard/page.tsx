import { auth } from "@/lib/auth";
import { getUserMeasurements, getUserUrls } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const [measurements, urls] = await Promise.all([
    getUserMeasurements(session.user.email),
    getUserUrls(session.user.email),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">ダッシュボード</h1>
      <DashboardContent measurements={measurements} urls={urls} />
    </div>
  );
}
