import "server-only";
import { createTRPCContext, appRouter } from "@himmel/api";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Create a server-side caller for use in Server Components
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: superjson,
});

const createCallerFactory = t.createCallerFactory;
const caller = createCallerFactory(appRouter);

export const serverTrpc = async () => {
  const ctx = await createTRPCContext();
  return caller(ctx);
};
