import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Routes that require authentication.
 * Everything under /app/* is protected; root / is the landing page (public).
 */
const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

export default function middleware(req: any, event: any) {
  if (!process.env.CLERK_SECRET_KEY) {
    return NextResponse.next();
  }

  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      const { userId } = await auth();
      if (!userId) {
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
      }
    }
  })(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
