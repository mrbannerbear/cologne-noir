export function resolveDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const explicit = env.DATABASE_URL;
  if (explicit) return explicit;

  const isProduction =
    env.VERCEL_ENV === "production" ||
    (env.VERCEL_ENV !== "preview" && env.NODE_ENV === "production");

  const url = isProduction ? env.DATABASE_PROD_URL : env.DATABASE_DEVELOPMENT_URL;

  if (!url) {
    throw new Error(
      "No database URL configured. Set DATABASE_URL, or DATABASE_PROD_URL / " +
        "DATABASE_DEVELOPMENT_URL for the current environment.",
    );
  }

  return url;
}