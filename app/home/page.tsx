"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Loader } from "@/components/shared/loader";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  const [showLoader, setShowLoader] = useState(false);
  const [canShowPage, setCanShowPage] = useState(false);

  useEffect(() => {
    // Clear loader flag when user logs out
    if (!isSignedIn) {
      sessionStorage.removeItem("home-loader-shown");
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setCanShowPage(true);
      return;
    }

    const loaderAlreadyShown = sessionStorage.getItem("home-loader-shown");

    if (loaderAlreadyShown) {
      setCanShowPage(true);
      return;
    }

    sessionStorage.setItem("home-loader-shown", "true");
    setShowLoader(true);

    const timer = setTimeout(() => {
      setShowLoader(false);
      setCanShowPage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  if (!canShowPage || showLoader) {
    return <Loader />;
  }

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