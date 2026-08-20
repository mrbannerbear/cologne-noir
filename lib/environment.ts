export type Environment = "production" | "preview" | "development";

export function getEnvironment(): Environment {
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv === "production" || vercelEnv === "preview") {
    return vercelEnv;
  }
  if (vercelEnv === "development") {
    return "development";
  }

  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function isProduction(): boolean {
  return getEnvironment() === "production";
}