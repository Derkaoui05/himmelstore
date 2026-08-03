"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Variant {
  id: string;
  size: string;
  price: any; // Decimal type from Prisma
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
  
  // Find the lowest price
  const prices = product.variants.map((v) => Number(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  
  // Gender labels
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
      className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-zinc-950/40 p-4 transition-all duration-300 hover:border-gold/50 hover:bg-zinc-900/50 hover:shadow-2xl hover:shadow-gold/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-900">
        <Image
          src={isHovered ? hoverImage : displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-500 group-hover:scale-105"
        />
        
        {/* Gender Badge */}
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 backdrop-blur-sm">
          {genderLabels[product.gender]}
        </span>
        
        {/* Concentration Badge */}
        {product.concentration && (
          <span className="absolute right-3 top-3 rounded-full bg-gold/10 border border-gold/20 px-3 py-1 text-[10px] font-semibold text-gold backdrop-blur-sm">
            {product.concentration}
          </span>
        )}
      </div>

      {/* Info Container */}
      <div className="mt-4 flex flex-col flex-grow">
        <span className="text-xs uppercase tracking-widest text-zinc-500">
          {product.brand}
        </span>
        <h3 className="mt-1 text-base font-semibold text-white group-hover:text-gold transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">
              À partir de
            </span>
            <span className="text-lg font-bold text-gold">
              {minPrice.toLocaleString("fr-FR")} DH
            </span>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-black">
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
