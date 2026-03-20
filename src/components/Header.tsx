"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Performance Lab
        </Link>
        <nav className="flex items-center gap-4">
          {session?.user && (
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          )}
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{session.user.name}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Log out
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
