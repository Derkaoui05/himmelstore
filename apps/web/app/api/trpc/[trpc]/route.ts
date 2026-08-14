import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@himmel/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const handler = async (req: Request) => {
  const session = await getServerSession(authOptions);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ session }),
  });
};

export { handler as GET, handler as POST };
