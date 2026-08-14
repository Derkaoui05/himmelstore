"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

  const prices = product.variants.map((v) => Number(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={isHovered ? hoverImage : displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-700 shadow-sm backdrop-blur-sm">
          {genderLabels[product.gender]}
        </span>

        {product.concentration && (
          <span className="absolute right-3 top-3 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold text-gold-dark backdrop-blur-sm">
            {product.concentration}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col grow">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {product.brand}
        </span>
        <h3 className="mt-1 text-base font-semibold text-foreground transition-colors group-hover:text-gold line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              À partir de
            </span>
            <span className="text-lg font-bold text-gold">
              {minPrice.toLocaleString("fr-FR")} DH
            </span>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-black">
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
