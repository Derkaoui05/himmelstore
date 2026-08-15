import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, userProcedure, router } from "../trpc";
import { RegisterCustomerInputSchema, UpdateCustomerProfileSchema } from "@himmel/types";
import { randomBytes, scryptSync } from "crypto";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export const customerRouter = router({
  /**
   * Register a new customer account
   */
  register: publicProcedure
    .input(RegisterCustomerInputSchema)
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase();

      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un compte avec cette adresse email existe déjà.",
        });
      }

      // Check if an admin uses this email
      const existingAdmin = await ctx.db.admin.findUnique({
        where: { email },
      });

      if (existingAdmin) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cette adresse email est réservée.",
        });
      }

      const hashedPassword = hashPassword(input.password);

      const newUser = await ctx.db.user.create({
        data: {
          name: input.name.trim(),
          email,
          password: hashedPassword,
          phone: input.phone?.trim() || null,
          city: input.city?.trim() || null,
          address: input.address?.trim() || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          address: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        message: "Compte créé avec succès.",
        user: newUser,
      };
    }),

  /**
   * Get the authenticated customer's profile
   */
  me: userProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) {
      // If it's an admin logged in
      if (ctx.session.user.role === "ADMIN") {
        return {
          id: ctx.session.user.id,
          name: ctx.session.user.name,
          email: ctx.session.user.email,
          phone: null,
          city: null,
          address: null,
          createdAt: new Date(),
        };
      }

      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Utilisateur introuvable.",
      });
    }

    return user;
  }),

  /**
   * Update the authenticated customer's profile
   */
  updateProfile: userProcedure
    .input(UpdateCustomerProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const updated = await ctx.db.user.update({
        where: { id: userId },
        data: {
          name: input.name.trim(),
          phone: input.phone?.trim() || null,
          city: input.city?.trim() || null,
          address: input.address?.trim() || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          address: true,
        },
      });

      return {
        success: true,
        message: "Profil mis à jour avec succès.",
        user: updated,
      };
    }),
});
