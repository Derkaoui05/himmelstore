"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </main>
    );
  }

  const genderLabels = {
    HOMME: "Homme",
    FEMME: "Femme",
    UNISEXE: "Unisexe",
  };

  return (
    <main className="min-h-[80vh] bg-[#FAF8F5] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark">
              Collection Privée
            </span>
            <h1 className="mt-1 font-heading text-3xl font-light text-stone-900 sm:text-4xl">
              Mes Favoris ({items.length})
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Retrouvez ici toutes vos fragrances coups de cœur enregistrées.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              type="button"
              className="text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Vider tous mes favoris
            </button>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-10 w-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
            <h2 className="mt-6 font-heading text-2xl font-semibold text-stone-900">
              Votre liste de favoris est vide
            </h2>
            <p className="mt-2 max-w-md text-sm text-stone-500">
              Explorez notre catalogue de haute parfumerie et cliquez sur le cœur pour enregistrer vos parfums préférés.
            </p>
            <Link
              href="/produits"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gold px-8 text-xs font-semibold uppercase tracking-widest text-stone-950 shadow-md transition-all hover:bg-gold-light hover:scale-105"
            >
              Découvrir les Parfums
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200/80 bg-white p-4 shadow-xs transition-all duration-300 hover:border-gold/60 hover:shadow-lg hover:shadow-gold/10"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F8F5F0]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-white/95 border border-stone-200/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-700 shadow-xs backdrop-blur-sm">
                    {genderLabels[item.gender]}
                  </span>

                  {item.concentration && (
                    <span className="absolute left-3 bottom-3 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-[10px] font-semibold text-gold-dark backdrop-blur-sm">
                      {item.concentration}
                    </span>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    type="button"
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-stone-200/70 bg-white/90 text-stone-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer shadow-xs"
                    title="Retirer des favoris"
                    aria-label="Retirer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="mt-4 flex flex-col grow">
                  <span className="text-xs uppercase tracking-widest text-stone-500">
                    {item.brand}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-stone-900 group-hover:text-gold-dark transition-colors line-clamp-1">
                    {item.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400">
                        À partir de
                      </span>
                      <span className="text-base font-bold text-gold-dark">
                        {item.minPrice.toLocaleString("fr-FR")} DH
                      </span>
                    </div>

                    <Link
                      href={`/produits/${item.slug}`}
                      className="inline-flex h-9 items-center justify-center rounded-full bg-gold px-4 text-xs font-semibold uppercase tracking-wider text-stone-950 transition-all hover:bg-gold-light hover:scale-105"
                    >
                      Voir le Parfum
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
