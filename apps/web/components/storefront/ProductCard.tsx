"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useWishlistStore } from "@/lib/wishlistStore";

interface Variant {
  id: string;
  size: string;
  price: any;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  images: string[];
  gender: "HOMME" | "FEMME" | "UNISEXE";
  concentration: string | null;
  variants: Variant[];
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const prices = product.variants.map((v) => Number(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      image: product.images[0] || "/placeholder-perfume.jpg",
      minPrice,
      gender: product.gender,
      concentration: product.concentration,
    });
  };

  const genderLabels = {
    HOMME: "Homme",
    FEMME: "Femme",
    UNISEXE: "Unisexe",
  };

  const displayImage = product.images[0] || "/placeholder-perfume.jpg";
  const hoverImage = product.images[1] || displayImage;

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200/80 bg-white p-4 shadow-xs transition-all duration-300 hover:border-gold/60 hover:shadow-lg hover:shadow-gold/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F8F5F0]">
        <Image
          src={isHovered ? hoverImage : displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-500 group-hover:scale-105"
        />

        {/* Wishlist Button on Card */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer shadow-xs ${
            isInWishlist
              ? "border-rose-300 bg-white text-rose-600 opacity-100"
              : "border-stone-200/70 bg-white/90 text-stone-500 hover:border-gold hover:text-gold-dark opacity-80 group-hover:opacity-100"
          }`}
          title={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-label="Favoris"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={isInWishlist ? "0" : "1.5"}
            className={`h-4 w-4 transition-transform ${isInWishlist ? "scale-110" : "hover:scale-110"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        <span className="absolute left-3 top-3 rounded-full bg-white/95 border border-stone-200/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-700 shadow-xs backdrop-blur-sm">
          {genderLabels[product.gender]}
        </span>

        {product.concentration && (
          <span className="absolute left-3 bottom-3 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-[10px] font-semibold text-gold-dark backdrop-blur-sm">
            {product.concentration}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col grow">
        <span className="text-xs uppercase tracking-widest text-stone-500">
          {product.brand}
        </span>
        <h3 className="mt-1 text-base font-semibold text-stone-900 transition-colors group-hover:text-gold-dark line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-stone-400">
              À partir de
            </span>
            <span className="text-lg font-bold text-gold-dark">
              {minPrice.toLocaleString("fr-FR")} DH
            </span>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-500 transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-stone-950">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
