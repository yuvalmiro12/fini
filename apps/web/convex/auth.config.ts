/**
 * Convex ↔ Clerk Auth Configuration
 *
 * Convex validates every incoming request against Clerk's JWT.
 * Set CLERK_JWT_ISSUER_DOMAIN in your Convex dashboard environment variables:
 *   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-clerk-domain>
 *
 * Find your domain at: Clerk Dashboard → API Keys → JWT Templates → Issuer
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
