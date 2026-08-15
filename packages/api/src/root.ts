import { router } from "./trpc";
import { productRouter } from "./routers/product";
import { orderRouter } from "./routers/order";
import { adminRouter } from "./routers/admin";
import { categoryRouter } from "./routers/category";
import { customerRouter } from "./routers/customer";

export const appRouter = router({
  product: productRouter,
  order: orderRouter,
  admin: adminRouter,
  category: categoryRouter,
  customer: customerRouter,
});

export type AppRouter = typeof appRouter;

