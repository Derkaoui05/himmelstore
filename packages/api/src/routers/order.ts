import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import { CheckoutInputSchema, OrderStatusSchema, UpdateOrderStatusSchema } from "@himmel/types";
import { Prisma } from "@himmel/db";

export const orderRouter = router({
  /**
   * Guest Checkout - Creates an order and decrements variant stocks.
   * Calculates the total server-side to prevent client tampering.
   */
  create: publicProcedure
    .input(CheckoutInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        let total = new Prisma.Decimal(0);
        const orderItemsData = [];

        // Validate items and calculate total
        for (const item of input.items) {
          const variant = await tx.variant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });

          if (!variant) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Variante de produit introuvable.`,
            });
          }

          if (!variant.product.active) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Le produit ${variant.product.name} n'est plus actif.`,
            });
          }

          if (variant.stock < item.quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Stock insuffisant pour ${variant.product.name} (${variant.size}). Stock disponible: ${variant.stock}.`,
            });
          }

          // Decrement stock in DB
          await tx.variant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          // Calculate items and total
          const itemTotal = variant.price.mul(item.quantity);
          total = total.add(itemTotal);

          orderItemsData.push({
            variantId: item.variantId,
            quantity: item.quantity,
            price: variant.price,
          });
        }

        // Generate a unique human-readable order number: HIM-YYYYMMDD-XXXX
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
        
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const countToday = await tx.order.count({
          where: {
            createdAt: {
              gte: startOfToday,
            },
          },
        });

        let sequenceNum = countToday + 1;
        let orderNumber = `HIM-${dateStr}-${String(sequenceNum).padStart(4, "0")}`;
        
        // Safety check if orderNumber is already taken (handling concurrency)
        let isUnique = false;
        let retries = 0;
        while (!isUnique && retries < 5) {
          const existing = await tx.order.findUnique({
            where: { orderNumber },
          });
          if (!existing) {
            isUnique = true;
          } else {
            sequenceNum++;
            orderNumber = `HIM-${dateStr}-${String(sequenceNum).padStart(4, "0")}`;
            retries++;
          }
        }

        // If still not unique, append random suffix
        if (!isUnique) {
          const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
          orderNumber = `HIM-${dateStr}-${String(sequenceNum).padStart(4, "0")}-${randomSuffix}`;
        }

        // Create the order in the database
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerName: input.customerName,
            phone: input.phone,
            city: input.city,
            address: input.address,
            notes: input.notes || null,
            total,
            items: {
              create: orderItemsData,
            },
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
        });

        return order;
      });
    }),

  /**
   * List all orders (Admin only) with filtering and pagination.
   */
  list: protectedProcedure
    .input(
      z.object({
        status: OrderStatusSchema.optional(),
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { status, page, limit } = input;
      const where: any = {};

      if (status) {
        where.status = status;
      }

      const [orders, totalCount] = await Promise.all([
        ctx.db.order.findMany({
          where,
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
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.db.order.count({ where }),
      ]);

      return {
        orders,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    }),

  /**
   * Update the status of an order (Admin only).
   * Restores inventory if order is cancelled, or decrements if re-enabled.
   */
  updateStatus: protectedProcedure
    .input(UpdateOrderStatusSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: input.orderId },
          include: {
            items: true,
          },
        });

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Commande introuvable.",
          });
        }

        // Handle inventory changes based on status transition
        if (input.status === "CANCELLED" && order.status !== "CANCELLED") {
          // Re-increment stock for cancelled items
          for (const item of order.items) {
            await tx.variant.update({
              where: { id: item.variantId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        } else if (order.status === "CANCELLED" && input.status !== "CANCELLED") {
          // Re-decrement stock and verify sufficient inventory
          for (const item of order.items) {
            const variant = await tx.variant.findUnique({
              where: { id: item.variantId },
              include: { product: true },
            });

            if (!variant) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Une variante de produit liée à cette commande n'existe plus.",
              });
            }

            if (variant.stock < item.quantity) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Stock insuffisant pour réactiver la commande. Produit: ${variant.product.name} (${variant.size}). Restant: ${variant.stock}`,
              });
            }

            await tx.variant.update({
              where: { id: item.variantId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }

        // Update the order status
        return tx.order.update({
          where: { id: input.orderId },
          data: {
            status: input.status,
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
        });
      });
    }),
});
