import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const adminRouter = router({
  /**
   * Fetch aggregate stats and charts data for the Admin Dashboard.
   * Enforced via protectedProcedure.
   */
  dashboardStats: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const daysCount = input.days;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysCount);
      startDate.setHours(0, 0, 0, 0);

      // 1. Get active orders (non-cancelled) in time range for revenue and orders stats
      const orders = await ctx.db.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      });

      // Calculate totals
      const totalOrdersCount = orders.length;
      const cancelledOrdersCount = orders.filter(o => o.status === "CANCELLED").length;
      const activeOrdersCount = totalOrdersCount - cancelledOrdersCount;
      
      const totalRevenue = orders
        .filter(o => o.status !== "CANCELLED")
        .reduce((sum, order) => sum + Number(order.total), 0);

      // 2. Generate daily chart data (revenue & order count per day)
      const dailyDataMap = new Map<string, { date: string; revenue: number; orders: number }>();
      for (let i = daysCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }); // e.g. "29 juil."
        const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
        dailyDataMap.set(key, { date: dateStr, revenue: 0, orders: 0 });
      }

      for (const order of orders) {
        if (order.status === "CANCELLED") continue;
        const key = order.createdAt.toISOString().slice(0, 10);
        const existing = dailyDataMap.get(key);
        if (existing) {
          existing.revenue += Number(order.total);
          existing.orders += 1;
        }
      }
      const dailyChartData = Array.from(dailyDataMap.values());

      // 3. Top selling products
      const orderItems = await ctx.db.orderItem.findMany({
        where: {
          order: {
            status: {
              not: "CANCELLED",
            },
            createdAt: {
              gte: startDate,
            },
          },
        },
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      });

      const productSalesMap = new Map<
        string,
        { id: string; name: string; brand: string; quantity: number; revenue: number; image: string }
      >();

      for (const item of orderItems) {
        const product = item.variant.product;
        const existing = productSalesMap.get(product.id);
        const itemRevenue = Number(item.price) * item.quantity;
        
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += itemRevenue;
        } else {
          productSalesMap.set(product.id, {
            id: product.id,
            name: product.name,
            brand: product.brand,
            quantity: item.quantity,
            revenue: itemRevenue,
            image: product.images[0] || "",
          });
        }
      }

      const topProducts = Array.from(productSalesMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // 4. Low stock variants alert (stock <= 5)
      const lowStockVariants = await ctx.db.variant.findMany({
        where: {
          stock: {
            lte: 5,
          },
          product: {
            active: true,
          },
        },
        include: {
          product: true,
        },
        orderBy: {
          stock: "asc",
        },
        take: 5,
      });

      return {
        summary: {
          totalRevenue,
          totalOrdersCount,
          activeOrdersCount,
          cancelledOrdersCount,
          lowStockAlertsCount: lowStockVariants.length,
        },
        dailyChartData,
        topProducts,
        lowStockAlerts: lowStockVariants.map(v => ({
          variantId: v.id,
          productName: v.product.name,
          brand: v.product.brand,
          size: v.size,
          stock: v.stock,
          sku: v.sku,
        })),
      };
    }),
});
