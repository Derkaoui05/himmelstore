"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { trpcReact } from "@/lib/trpc-client";

interface FiltersProps {
  currentGender?: string;
  currentBrand?: string;
  currentCategory?: string;
  currentPriceMin?: string;
  currentPriceMax?: string;
  currentSearch?: string;
}

export default function ProductFilters({
  currentGender = "",
  currentBrand = "",
  currentCategory = "",
  currentPriceMin = "",
  currentPriceMax = "",
  currentSearch = "",
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [gender, setGender] = useState(currentGender);
  const [brand, setBrand] = useState(currentBrand);
  const [category, setCategory] = useState(currentCategory);
  const [priceMin, setPriceMin] = useState(currentPriceMin);
  const [priceMax, setPriceMax] = useState(currentPriceMax);
  const [search, setSearch] = useState(currentSearch);

  // Fetch categories using tRPC
  const { data: categories } = trpcReact.category.list.useQuery();

  // Unique list of luxury brands (preset, or we could fetch from api. Since it is a client storefront, we list the prominent ones)
  const brands = ["Chanel", "Dior", "Yves Saint Laurent", "Lancôme", "Tom Ford", "Armani", "Guerlain", "Hermès"];

  // Sync state with URL params
  useEffect(() => {
    setGender(searchParams.get("gender") || "");
    setBrand(searchParams.get("brand") || "");
    setCategory(searchParams.get("category") || "");
    setPriceMin(searchParams.get("priceMin") || "");
    setPriceMax(searchParams.get("priceMax") || "");
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const applyFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page on filter change
    params.set("page", "1");

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/produits?${params.toString()}`);
  };

  const handleReset = () => {
    setGender("");
    setBrand("");
    setCategory("");
    setPriceMin("");
    setPriceMax("");
    setSearch("");
    router.push("/produits");
  };

  return (
    <div className="flex flex-col gap-8 rounded-xl border border-white/5 bg-zinc-950/40 p-6 backdrop-blur-sm">
      {/* Search Input */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
          Rechercher
        </h3>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Ex: Sauvage, Dior..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters({ search })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                applyFilters({ search: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Gender Filters */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
          Genre
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {["HOMME", "FEMME", "UNISEXE"].map((g) => (
            <button
              key={g}
              onClick={() => {
                const newGender = gender === g ? "" : g;
                setGender(newGender);
                applyFilters({ gender: newGender });
              }}
              className={`rounded-lg border px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                gender === g
                  ? "border-gold bg-gold text-black"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {g === "HOMME" ? "Homme" : g === "FEMME" ? "Femme" : "Unisexe"}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      {categories && categories.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Catégorie
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  const newCategory = category === cat.slug ? "" : cat.slug;
                  setCategory(newCategory);
                  applyFilters({ category: newCategory });
                }}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                  category === cat.slug
                    ? "bg-gold/10 text-gold font-medium"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <span>{cat.name}</span>
                {category === cat.slug && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand Filters */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
          Marque
        </h3>
        <div className="mt-3 flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => {
                const newBrand = brand === b ? "" : b;
                setBrand(newBrand);
                applyFilters({ brand: newBrand });
              }}
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all ${
                brand === b
                  ? "text-gold font-medium"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>{b}</span>
              {brand === b && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
          Prix (DH)
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-gold focus:outline-none"
          />
          <span className="text-zinc-600 text-xs">—</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-gold focus:outline-none"
          />
        </div>
        <button
          onClick={() => applyFilters({ priceMin, priceMax })}
          className="mt-3 w-full rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 py-2 hover:text-white transition-colors"
        >
          Appliquer le prix
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="mt-4 w-full rounded-lg border border-zinc-800 hover:border-zinc-700 py-2.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
