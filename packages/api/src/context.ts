import { db } from "@himmel/db";

export interface CreateContextOptions {
  session: any | null; // NextAuth session passed from Next.js route handler
}

/**
 * Creates context for tRPC requests.
 * Decoupled from Next.js request/response objects so it is reusable.
 */
export const createTRPCContext = async (opts?: CreateContextOptions) => {
  return {
    db,
    session: opts?.session ?? null,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
