import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function cleanDatabaseUrl(url: string): string {
  const parsed = new URL(url);

  // Prisma-only flag; not understood by the pg driver
  parsed.searchParams.delete("pgbouncer");

  // sslmode=require is parsed by pg into ssl: {}, which overrides Pool ssl config
  // and rejects Supabase's certificate chain on Vercel
  parsed.searchParams.delete("sslmode");

  return parsed.toString();
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const cleanUrl = cleanDatabaseUrl(url);

  const pool = new Pool({
    connectionString: cleanUrl,
    ssl: {
      rejectUnauthorized: false,
    },
    // PgBouncer compatibility: disable prepared statements
    max: 1,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
      ? (["query", "error", "warn"] as const)
      : (["error"] as const),
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export * from "../generated/prisma";
