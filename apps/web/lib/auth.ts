import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@himmel/db";
import { randomBytes, scryptSync } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  if (!salt || !hash) return false;
  
  const testHash = scryptSync(password, salt, 64).toString("hex");
  return testHash === hash;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "votre@email.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Veuillez saisir votre email et mot de passe.");
        }

        const email = credentials.email.trim().toLowerCase();

        // Check if there is an Admin with this email
        const admin = await db.admin.findUnique({
          where: { email },
        });

        if (admin) {
          const isValid = verifyPassword(credentials.password, admin.password);
          if (isValid) {
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: "ADMIN",
            } as any;
          }
        }

        // Otherwise check if there is a customer User
        const user = await db.user.findUnique({
          where: { email },
        });

        if (user) {
          const isValid = verifyPassword(credentials.password, user.password);
          if (isValid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: "USER",
              phone: user.phone,
              city: user.city,
              address: user.address,
            } as any;
          }
        }

        throw new Error("Email ou mot de passe incorrect.");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/connexion",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.phone = (user as any).phone;
        token.city = (user as any).city;
        token.address = (user as any).address;
      }

      // Handle session updates (e.g. when user edits their profile)
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.phone !== undefined) token.phone = session.phone;
        if (session.city !== undefined) token.city = session.city;
        if (session.address !== undefined) token.address = session.address;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "USER";
        (session.user as any).phone = token.phone || null;
        (session.user as any).city = token.city || null;
        (session.user as any).address = token.address || null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretdevelopmentkeythatislongenough",
};

