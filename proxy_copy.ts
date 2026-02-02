import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/optimizations",
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, redirectToSignIn, isAuthenticated } = await auth();
  const isOnboarded = sessionClaims?.metadata?.onboardingCompleted;

  // user yang belum login tidak boleh mengakses halaman private
  if (!isAuthenticated) {
    if (isApiRoute(req)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!isPublicRoute(req)) {
      return redirectToSignIn();
    }
    return;
  }

  // user yang sudah login tidak boleh mengakses halaman public
  if (isAuthenticated && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // user yang sudah login tapi belum onboarding harus diarahkan ke halaman onboarding
  if (!isOnboarded && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // user yang sudah onboarding tidak boleh mengakses halaman onboarding
  if (isOnboarded && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
