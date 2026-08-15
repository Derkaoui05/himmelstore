import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import ProductCard from "@/components/storefront/ProductCard";
import { serverTrpc } from "@/lib/trpc-server";

export const revalidate = 60; // revalidate every minute

export default async function Home() {
  let featuredProducts: any[] = [];
  
  try {
    const trpc = await serverTrpc();
    featuredProducts = await trpc.product.getFeatured({ limit: 4 });
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-stone-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-50/70 via-cream to-[#F3EFE6] px-6 py-20">
        {/* Decorative ambient gold light */}
        <div className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-[130px] pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark border border-gold/20 animate-fade-in">
            Haute Parfumerie
          </span>
          <h1 className="mt-6 font-heading text-4xl font-light tracking-wide text-stone-900 sm:text-6xl md:text-7xl leading-tight">
            L'Élégance Olfactive <br />
            <span className="font-serif italic text-gold font-normal">Revisitée</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm text-stone-600 sm:text-base leading-relaxed tracking-wide">
            Une sélection exclusive des plus grandes maisons de parfums. L'excellence et le luxe, livrés directement chez vous partout au Maroc.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/produits"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-8 text-sm font-semibold uppercase tracking-wider text-stone-950 shadow-md transition-all duration-300 hover:bg-gold-light hover:scale-105 active:scale-95"
            >
              Découvrir la collection
            </Link>
            <Link
              href="/produits?gender=UNISEXE"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white px-8 text-sm font-semibold uppercase tracking-wider text-stone-700 shadow-sm transition-all duration-300 hover:border-gold hover:text-gold-dark hover:bg-stone-50"
            >
              Collection Unisexe
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-stone-200/80 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">100% Authentique</h3>
              <p className="mt-2 text-xs text-stone-500 max-w-60">Tous nos parfums proviennent directement des canaux officiels certifiés.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.29-4.82c-.04-.661-.593-1.176-1.257-1.176H4.135m14.865 0H18.75a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125V3.375A3.375 3.375 0 009.75 0h-1.5L8.25 3.375a1.125 1.125 0 01-1.125 1.125v1.5a3.375 3.375 0 003.375 3.375h1.5a1.125 1.125 0 011.125 1.125v1.5" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Livraison Partout au Maroc</h3>
              <p className="mt-2 text-xs text-stone-500 max-w-60">Expédition rapide en 24/48h. Livraison gratuite à domicile.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m15 0h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Paiement à la Livraison</h3>
              <p className="mt-2 text-xs text-stone-500 max-w-60">Payez en toute sécurité en espèces lors de la réception de votre colis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">Notre Sélection</span>
              <h2 className="mt-2 font-heading text-3xl font-light text-stone-900 sm:text-4xl">Les Plus Demandés</h2>
            </div>
            <Link
              href="/produits"
              className="group mt-4 md:mt-0 flex items-center gap-2 text-sm font-semibold text-gold-dark hover:text-gold transition-colors"
            >
              Voir toute la boutique
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl border border-dashed border-stone-200 bg-white/60">
              <p className="text-stone-500 text-sm">Aucun produit vedette disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Brand Grid */}
      <section className="py-24 border-t border-stone-200/80 bg-[#F4EFE6]/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="text-center font-heading text-2xl font-light text-stone-900 tracking-widest uppercase mb-16">
            Nos Grandes Marques
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 items-center justify-items-center">
            {["Chanel", "Dior", "Yves Saint Laurent", "Tom Ford"].map((brand) => (
              <Link
                key={brand}
                href={`/produits?brand=${brand}`}
                className="font-heading text-lg font-bold tracking-widest text-stone-400 hover:text-gold-dark transition-colors duration-300"
              >
                {brand.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
