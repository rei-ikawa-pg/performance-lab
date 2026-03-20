import { auth } from "@/lib/auth";
import { MeasureForm } from "@/components/MeasureForm";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold">Performance Lab</h1>
      <p className="mb-8 text-center text-muted-foreground">
        Measure Core Web Vitals and get actionable improvement suggestions for any URL.
      </p>

      {session?.user ? (
        <MeasureForm />
      ) : (
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">
            Sign in with Google to start measuring your website&apos;s performance.
          </p>
        </div>
      )}
    </div>
  );
}
