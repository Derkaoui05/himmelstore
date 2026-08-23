import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { randomBytes, scryptSync } from "crypto";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export const adminRouter = router({
  /**
   * List all admin accounts
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  /**
   * Create a new admin user
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        email: z.string().email("Adresse email invalide"),
        password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase();

      // Check email conflict in Admin
      const existingAdmin = await ctx.db.admin.findUnique({
        where: { email },
      });

      if (existingAdmin) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un administrateur avec cette adresse email existe déjà.",
        });
      }

      const hashedPassword = hashPassword(input.password);

      const newAdmin = await ctx.db.admin.create({
        data: {
          name: input.name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      return newAdmin;
    }),

  /**
   * Update an existing admin's details (name, email, optional new password)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        email: z.string().email("Adresse email invalide"),
        password: z.string().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase();

      const existingAdmin = await ctx.db.admin.findUnique({
        where: { id: input.id },
      });

      if (!existingAdmin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Administrateur non trouvé.",
        });
      }

      // Check email collision if email changed
      if (email !== existingAdmin.email) {
        const emailConflict = await ctx.db.admin.findUnique({
          where: { email },
        });

        if (emailConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Cette adresse email est déjà utilisée par un autre administrateur.",
          });
        }
      }

      const updateData: { name: string; email: string; password?: string } = {
        name: input.name,
        email,
      };

      if (input.password && input.password.trim().length >= 6) {
        updateData.password = hashPassword(input.password.trim());
      }

      return ctx.db.admin.update({
        where: { id: input.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          updatedAt: true,
        },
      });
    }),

  /**
   * Delete an admin account
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.db.admin.count();

      if (count <= 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Impossible de supprimer le dernier administrateur du système.",
        });
      }

      const admin = await ctx.db.admin.findUnique({
        where: { id: input.id },
      });

      if (!admin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Administrateur introuvable.",
        });
      }

      await ctx.db.admin.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Dashboard statistics
   */
  dashboardStats: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const since = new Date();
      since.setDate(since.getDate() - input.days);

      // Fetch all orders in the date range
      const orders = await ctx.db.order.findMany({
        where: {
          createdAt: { gte: since },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      // Summary stats
      const activeOrders = orders.filter((o) => o.status !== "CANCELLED");
      const cancelledOrders = orders.filter((o) => o.status === "CANCELLED");
      const totalRevenue = activeOrders.reduce(
        (sum, o) => sum + Number(o.total),
        0
      );

      // Low stock alerts
      const lowStockVariants = await ctx.db.variant.findMany({
        where: { stock: { lte: 5 } },
        include: { product: true },
        orderBy: { stock: "asc" },
        take: 10,
      });

      // Revenue per day
      const revenueByDay: Record<string, { revenue: number; orders: number }> = {};
      for (const order of activeOrders) {
        const day = order.createdAt.toISOString().slice(0, 10);
        if (!revenueByDay[day]) revenueByDay[day] = { revenue: 0, orders: 0 };
        revenueByDay[day].revenue += Number(order.total);
        revenueByDay[day].orders += 1;
      }

      const revenuePerDay = Object.entries(revenueByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
          date,
          revenue: Math.round(data.revenue * 100) / 100,
          orders: data.orders,
        }));

      // Top products
      const productSales: Record<
        string,
        { id: string; name: string; brand: string; quantity: number; revenue: number }
      > = {};
      for (const order of activeOrders) {
        for (const item of order.items) {
          const pid = item.variant.product.id;
          if (!productSales[pid]) {
            productSales[pid] = {
              id: pid,
              name: item.variant.product.name,
              brand: item.variant.product.brand,
              quantity: 0,
              revenue: 0,
            };
          }
          productSales[pid].quantity += item.quantity;
          productSales[pid].revenue += Number(item.price) * item.quantity;
        }
      }

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((p) => ({
          ...p,
          revenue: Math.round(p.revenue * 100) / 100,
        }));

      return {
        summary: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrdersCount: orders.length,
          activeOrdersCount: activeOrders.length,
          cancelledOrdersCount: cancelledOrders.length,
          lowStockAlertsCount: lowStockVariants.length,
        },
        dailyChartData: revenuePerDay,
        revenuePerDay,
        topProducts,
        lowStockAlerts: lowStockVariants.map((v) => ({
          variantId: v.id,
          productName: v.product.name,
          brand: v.product.brand,
          size: v.size,
          sku: v.sku,
          stock: v.stock,
        })),
      };
    }),

  /**
   * Get store branding settings (Public for storefront & admin)
   */
  getStoreSettings: publicProcedure.query(async ({ ctx }) => {
    let setting = await ctx.db.storeSetting.findUnique({
      where: { id: "default" },
    });

    if (!setting) {
      setting = await ctx.db.storeSetting.create({
        data: {
          id: "default",
          storeName: "HIMMEL",
          storeTagline: "fatima zahrae derkaoui",
          logoMode: "TEXT_ONLY",
        },
      });
    }

    return setting;
  }),

  /**
   * Update store branding settings (Admin only)
   */
  updateStoreSettings: protectedProcedure
    .input(
      z.object({
        storeName: z.string().min(1, "Le nom de la boutique est requis"),
        storeTagline: z.string().optional().default(""),
        logoUrl: z.string().optional().nullable(),
        logoMode: z.enum(["TEXT_ONLY", "IMAGE_ONLY", "IMAGE_AND_TEXT"]).default("TEXT_ONLY"),
        faviconUrl: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const setting = await ctx.db.storeSetting.upsert({
        where: { id: "default" },
        update: {
          storeName: input.storeName,
          storeTagline: input.storeTagline || "",
          logoUrl: input.logoUrl || null,
          logoMode: input.logoMode,
          faviconUrl: input.faviconUrl || null,
        },
        create: {
          id: "default",
          storeName: input.storeName,
          storeTagline: input.storeTagline || "",
          logoUrl: input.logoUrl || null,
          logoMode: input.logoMode,
          faviconUrl: input.faviconUrl || null,
        },
      });

      return setting;
    }),
});


