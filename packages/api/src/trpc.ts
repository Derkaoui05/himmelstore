import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces the caller is an authenticated User or Admin.
 */
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Vous devez être connecté pour effectuer cette action.",
    });
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  });
});

/**
 * Reusable middleware that enforces the caller is an Admin.
 */
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Vous devez être connecté en tant qu'administrateur pour effectuer cette action.",
    });
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  });
});

export const userProcedure = t.procedure.use(isAuthenticated);
export const protectedProcedure = t.procedure.use(isAdmin);

