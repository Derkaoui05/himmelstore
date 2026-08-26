import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import HomeClient from "@/components/storefront/HomeClient";
import { serverTrpc } from "@/lib/trpc-server";

export const revalidate = 60; // revalidate every minute

export default async function Home() {
  let featuredProducts: any[] = [];
  let allProducts: any[] = [];
  let categories: any[] = [];
  let storeSettings: any = null;

  try {
    const trpc = await serverTrpc();
    const [featured, listResult, categoriesList, settings] = await Promise.all([
      trpc.product.getFeatured({ limit: 8 }),
      trpc.product.list({ limit: 12 }),
      trpc.category.list(),
      trpc.admin.getStoreSettings(),
    ]);

    featuredProducts = featured || [];
    allProducts = listResult?.products || [];
    categories = categoriesList || [];
    storeSettings = settings || null;
  } catch (error) {
    console.error("Failed to fetch initial home data:", error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-stone-900">
      <Navbar />
      <main className="grow">
        <HomeClient
          featuredProducts={featuredProducts}
          allProducts={allProducts}
          categories={categories}
          storeSettings={storeSettings}
        />
      </main>
      <Footer />
    </div>
  );
}
