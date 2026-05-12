import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isLandingPage = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // If user is signed in and trying to access landing page, redirect to home
  if (userId && isLandingPage(req)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  
  // If user is signed in and trying to access auth pages, redirect to home
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  
  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};