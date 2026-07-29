import { router } from "./trpc";
import { productRouter } from "./routers/product";
import { orderRouter } from "./routers/order";
import { adminRouter } from "./routers/admin";
import { categoryRouter } from "./routers/category";

export const appRouter = router({
  product: productRouter,
  order: orderRouter,
  admin: adminRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
