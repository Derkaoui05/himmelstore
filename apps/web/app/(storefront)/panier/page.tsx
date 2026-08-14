"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="grow flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 grow">
        <h1 className="font-heading text-3xl font-light text-white sm:text-4xl">
          Votre Panier
        </h1>

        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-16 w-16 text-zinc-700 mb-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <h2 className="text-xl font-medium text-zinc-300">Votre panier est vide</h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm">
              Découvrez nos fragrances uniques et trouvez votre signature olfactive.
            </p>
            <Link
              href="/produits"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gold px-8 text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:scale-105"
            >
              Continuer les achats
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left: Items List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center gap-6 rounded-xl border border-white/5 bg-zinc-950/40 p-4"
                >
                  {/* Thumbnail */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex flex-grow flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                          {item.brand}
                        </span>
                        <h3 className="text-sm font-semibold text-white">
                          <Link href={`/produits/${item.productSlug}`} className="hover:text-gold transition-colors">
                            {item.productName}
                          </Link>
                        </h3>
                        <p className="mt-1 text-xs text-zinc-400">Taille: {item.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-zinc-500 hover:text-rose-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity controls & Price */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/50">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
                        >
                          &minus;
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
                        >
                          &#43;
                        </button>
                      </div>

                      <span className="text-base font-bold text-gold">
                        {(item.price * item.quantity).toLocaleString("fr-FR")} DH
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Summary Panel */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6">
                <h2 className="text-lg font-semibold text-white">Récapitulatif</h2>
                
                <div className="mt-6 flex flex-col gap-4 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Sous-total</span>
                    <span>{getTotal().toLocaleString("fr-FR")} DH</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Livraison</span>
                    <span className="text-emerald-500 font-semibold">Gratuite</span>
                  </div>
                  
                  <div className="border-t border-white/5 my-2 pt-4 flex justify-between text-base font-bold text-white">
                    <span>Total</span>
                    <span className="text-gold">{getTotal().toLocaleString("fr-FR")} DH</span>
                  </div>
                </div>

                <Link
                  href="/commande"
                  className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-gold text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:scale-105"
                >
                  Passer la commande
                </Link>
                
                <div className="mt-6 flex justify-center">
                  <Link href="/produits" className="text-xs text-zinc-500 hover:text-gold transition-colors">
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
  );
}
