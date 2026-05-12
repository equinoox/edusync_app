"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-bold">EduSync</h1>

        <div className="flex items-center gap-4">
          <Link href="/chat" className="hover:underline">
            AI Assistant
          </Link>

            {!isSignedIn ? (
            <SignInButton mode="modal">
                <button className="rounded-md bg-black px-4 py-2 text-white">
                Sign in
                </button>
            </SignInButton>
            ) : (
            <UserButton />
            )}
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center gap-6 pt-32 text-center">
        <h2 className="text-4xl font-bold">Learn smarter with EduSync 📚</h2>

        <p className="max-w-xl text-muted-foreground">
          Access your learning tools, AI assistant, and study resources from one place.
        </p>
      </section>
    </main>
  );
}