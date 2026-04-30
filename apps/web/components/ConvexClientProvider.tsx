"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3210"
);

/**
 * ConvexClientProvider — wraps the app with Clerk + Convex.
 *
 * ConvexProviderWithClerk automatically passes the Clerk JWT to every
 * Convex request, so all auth.getUserIdentity() calls inside Convex
 * functions work without any extra plumbing.
 */
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
        "pk_test_ZHVtbXkua2V5LmNsZXJrLmFjY291bnRzLmRldiQ" // Fallback dummy key for Next.js build prerendering
      }
      appearance={{
        variables: {
          colorPrimary: "#C85A8A",
          colorBackground: "#FDDDE8",
          colorText: "#1F1A15",
          borderRadius: "16px",
          fontFamily: "'Rubik', system-ui, sans-serif",
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth as any}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
