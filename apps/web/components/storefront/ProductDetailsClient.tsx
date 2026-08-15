"use client";

import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/lib/store";

interface Variant {
  id: string;
  size: string;
  price: any; // Decimal
  stock: number;
  sku: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  images: string[];
  gender: "HOMME" | "FEMME" | "UNISEXE";
  concentration: string | null;
  category: Category;
  variants: Variant[];
}

export default function ProductDetailsClient({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const [activeImage, setActiveImage] = useState<string>(product.images[0] || "/placeholder-perfume.jpg");
  const [isAdded, setIsAdded] = useState(false);
  const addItemToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;

    addItemToCart({
      variantId: selectedVariant.id,
      productName: product.name,
      productSlug: product.slug,
      brand: product.brand,
      size: selectedVariant.size,
      price: Number(selectedVariant.price),
      image: product.images[0] || "/placeholder-perfume.jpg",
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const genderLabels = {
    HOMME: "Pour Homme",
    FEMME: "Pour Femme",
    UNISEXE: "Collection Unisexe",
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* Left: Gallery */}
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-xs">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />
        </div>
        
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border bg-white transition-all cursor-pointer ${
                  activeImage === img ? "border-gold ring-2 ring-gold/30" : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} - image ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Info Panel */}
      <div className="flex flex-col">
        {/* Breadcrumb & Gender */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-stone-400 font-medium">
          <span className="text-stone-600">{product.brand}</span>
          <span className="h-1 w-1 rounded-full bg-stone-300" />
          <span>{genderLabels[product.gender]}</span>
        </div>

        {/* Product Title */}
        <h1 className="mt-4 font-heading text-3xl font-light text-stone-900 sm:text-4xl leading-tight">
          {product.name}
        </h1>

        {/* Concentration */}
        {product.concentration && (
          <div className="mt-2 text-sm font-semibold tracking-wide text-gold-dark">
            {product.concentration}
          </div>
        )}

        {/* Pricing */}
        <div className="mt-6 flex items-baseline gap-4 border-y border-stone-200/80 py-4">
          <span className="text-3xl font-bold text-gold-dark">
            {Number(selectedVariant.price).toLocaleString("fr-FR")} DH
          </span>
          <span className="text-xs text-stone-500 uppercase tracking-wider">
            TVA Incluse / Livraison Gratuite
          </span>
        </div>

        {/* Variant Selectors (Sizes) */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Sélectionner la Taille
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`rounded-lg border px-5 py-3 text-sm font-medium tracking-wide transition-all cursor-pointer ${
                  selectedVariant.id === v.id
                    ? "border-gold bg-gold/15 text-gold-dark font-semibold shadow-xs"
                    : "border-stone-200 bg-[#FAF8F5] text-stone-700 hover:border-stone-300 hover:bg-white"
                }`}
              >
                {v.size} — {Number(v.price).toLocaleString("fr-FR")} DH
              </button>
            ))}
          </div>
        </div>

        {/* Stock status */}
        <div className="mt-6 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              selectedVariant.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          />
          <span className="text-xs font-medium text-stone-600">
            {selectedVariant.stock > 0
              ? `En stock (${selectedVariant.stock} disponibles)`
              : "Rupture de stock"}
          </span>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={selectedVariant.stock <= 0}
          className={`mt-8 flex h-14 w-full items-center justify-center rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-md ${
            selectedVariant.stock > 0
              ? isAdded
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-gold text-stone-950 hover:bg-gold-light hover:scale-[1.02] active:scale-95"
              : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
          }`}
        >
          {selectedVariant.stock > 0
            ? isAdded
              ? "✓ Ajouté au panier"
              : "Ajouter au panier"
            : "Rupture de stock"}
        </button>

        {/* Description */}
        <div className="mt-10 border-t border-stone-200/80 pt-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
            Description
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
