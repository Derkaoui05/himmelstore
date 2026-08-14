import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

import { Pool } from "pg";

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString: url,
    ssl: {
      rejectUnauthorized: false,
    },
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

