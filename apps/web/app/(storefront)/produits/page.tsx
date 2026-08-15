import ProductFilters from "@/components/storefront/ProductFilters";
import ProductCard from "@/components/storefront/ProductCard";
import { serverTrpc } from "@/lib/trpc-server";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    gender?: string;
    brand?: string;
    category?: string;
    priceMin?: string;
    priceMax?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const gender = params.gender;
  const brand = params.brand;
  const categorySlug = params.category;
  const search = params.search;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const priceMin = params.priceMin ? parseFloat(params.priceMin) : undefined;
  const priceMax = params.priceMax ? parseFloat(params.priceMax) : undefined;

  let productsData: any = { products: [], totalCount: 0, totalPages: 1, currentPage: 1 };

  try {
    const trpc = await serverTrpc();
    productsData = await trpc.product.list({
      gender: gender as any,
      brand,
      categorySlug,
      priceMin,
      priceMax,
      search,
      page,
      limit: 9,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  // Create page links helper
  const createPageUrl = (pageNumber: number) => {
    const searchParamsObj = new URLSearchParams();
    if (gender) searchParamsObj.set("gender", gender);
    if (brand) searchParamsObj.set("brand", brand);
    if (categorySlug) searchParamsObj.set("category", categorySlug);
    if (search) searchParamsObj.set("search", search);
    if (params.priceMin) searchParamsObj.set("priceMin", params.priceMin);
    if (params.priceMax) searchParamsObj.set("priceMax", params.priceMax);
    searchParamsObj.set("page", pageNumber.toString());
    return `/produits?${searchParamsObj.toString()}`;
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 grow">
      {/* Page Header */}
      <div className="border-b border-stone-200/80 pb-8 mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">Explorez</span>
        <h1 className="mt-2 font-heading text-3xl font-light sm:text-4xl text-stone-900">
          Catalogue des Parfums
        </h1>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <ProductFilters
            currentGender={gender}
            currentBrand={brand}
            currentCategory={categorySlug}
            currentPriceMin={params.priceMin}
            currentPriceMax={params.priceMax}
            currentSearch={search}
          />
        </aside>

        {/* Product Grid & List */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          {productsData.products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productsData.products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-dashed border-stone-200 bg-white/70 text-center shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-stone-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="text-base font-semibold text-stone-800">Aucun produit trouvé</h3>
              <p className="mt-1 text-sm text-stone-500 max-w-sm">
                Essayez d'élargir vos critères de recherche ou réinitialisez les filtres pour voir plus de parfums.
              </p>
              <Link
                href="/produits"
                className="mt-6 rounded-full bg-white border border-stone-200 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 shadow-xs hover:border-gold hover:text-gold-dark hover:bg-stone-50 transition-colors"
              >
                Tous les parfums
              </Link>
            </div>
          )}

          {/* Pagination */}
          {productsData.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 border-t border-stone-200/80 pt-8">
              {/* Prev page button */}
              {page > 1 ? (
                <Link
                  href={createPageUrl(page - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white hover:border-gold transition-colors text-stone-600 hover:text-gold-dark shadow-xs"
                >
                  &larr;
                </Link>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-100 bg-stone-100/50 text-stone-300 cursor-not-allowed">
                  &larr;
                </span>
              )}

              {/* Page numbers */}
              {Array.from({ length: productsData.totalPages }).map((_, idx) => {
                const pNum = idx + 1;
                const isCurrent = pNum === page;
                return (
                  <Link
                    key={pNum}
                    href={createPageUrl(pNum)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all shadow-xs ${
                      isCurrent
                        ? "border-gold bg-gold text-stone-950 shadow-xs font-bold"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
                    }`}
                  >
                    {pNum}
                  </Link>
                );
              })}

              {/* Next page button */}
              {page < productsData.totalPages ? (
                <Link
                  href={createPageUrl(page + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white hover:border-gold transition-colors text-stone-600 hover:text-gold-dark shadow-xs"
                >
                  &rarr;
                </Link>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-100 bg-stone-100/50 text-stone-300 cursor-not-allowed">
                  &rarr;
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
