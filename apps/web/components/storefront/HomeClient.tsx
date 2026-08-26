"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description?: string;
  gender: "HOMME" | "FEMME" | "UNISEXE";
  concentration: string | null;
  images: string[];
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  featured: boolean;
  variants: {
    id: string;
    size: string;
    price: number | any;
    stock: number;
    sku: string;
  }[];
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface HomeClientProps {
  featuredProducts: Product[];
  allProducts: Product[];
  categories: { id: string; name: string; slug: string }[];
  storeSettings?: {
    storeName?: string;
    storeTagline?: string;
    logoUrl?: string | null;
    logoMode?: string;
  } | null;
}

const OLFACTORY_UNIVERSES = [
  {
    title: "Boisé & Épicé",
    slug: "boise-epice",
    subtitle: "Oud, Santal & Cèdre de l'Atlas",
    description: "Des sillages profonds et chaleureux aux accords de bois rares, résines précieuses et épices vibrantes.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    badge: "Signature Noble",
    filterParam: "gender=UNISEXE",
  },
  {
    title: "Floral & Envoûtant",
    slug: "floral-sucre",
    subtitle: "Fleur d'Oranger, Rose & Jasmin",
    description: "Une élégance solaire inspirée des jardins méditerranéens et des fleurs blanches les plus nobles.",
    image: "https://www.paranewera.com/8525-large_default/nuxe-huile-prodigieuse-florale-100-ml.jpg",
    badge: "Solaire & Sensuel",
    filterParam: "gender=FEMME",
  },
  {
    title: "Frais & Hespéridé",
    slug: "frais-hesperide",
    subtitle: "Bergamote, Cédrat & Embruns",
    description: "Une fraîcheur vive et cristalline, mariant agrumes italiens, herbes aromatiques et brise océanique.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    badge: "Énergie Pure",
    filterParam: "gender=HOMME",
  },
  {
    title: "Oriental & Ambré",
    slug: "oriental-ambre",
    subtitle: "Ambre Gris, Vanille & Encens",
    description: "Des compositions mystiques et charnelles au magnétisme irrésistible qui laissent un sillage inoubliable.",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    badge: "Sillage Éternel",
    filterParam: "gender=UNISEXE",
  },
];

const PRESTIGE_HOUSES = [
  "TOM FORD",
  "CHANEL",
  "DIOR PRIVÉE",
  "YVES SAINT LAURENT",
  "BYREDO",
  "KILIAN PARIS",
  "MAISON FRANCIS KURKDJIAN",
  "CREED",
  "PARFUMS DE MARLY",
  "LANCÔME",
];

export default function HomeClient({
  featuredProducts,
  allProducts,
  categories,
  storeSettings,
}: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "HOMME" | "FEMME" | "UNISEXE">("ALL");

  // Hero spotlight product (e.g. Tom Ford Oud Wood or first featured)
  const heroProduct = useMemo(() => {
    return (
      featuredProducts.find((p) => p.name.toLowerCase().includes("oud") || p.brand.toLowerCase().includes("tom ford")) ||
      featuredProducts[0] ||
      allProducts[0]
    );
  }, [featuredProducts, allProducts]);

  // Filtered products list based on active tab
  const filteredProducts = useMemo(() => {
    const list = allProducts.length > 0 ? allProducts : featuredProducts;
    if (activeTab === "ALL") return list.slice(0, 8);
    return list.filter((p) => p.gender === activeTab).slice(0, 8);
  }, [allProducts, featuredProducts, activeTab]);

  return (
    <div className="flex flex-col bg-cream text-stone-900 selection:bg-gold/20 selection:text-stone-900">
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      <div className="border-b border-stone-200/60 bg-stone-950 px-4 py-2.5 text-center text-[11px] font-medium tracking-wider text-amber-100/90 sm:text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 sm:gap-6">
          <span className="flex items-center gap-1.5 font-semibold text-gold">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            LIVRAISON GRATUITE 24-48H PARTOUT AU MAROC
          </span>
          <span className="hidden sm:inline text-stone-600">•</span>
          <span className="hidden sm:inline text-stone-300">2 ÉCHANTILLONS DE NICHE OFFERTS DANS CHAQUE COMMANDE</span>
          <span className="hidden md:inline text-stone-600">•</span>
          <span className="hidden md:inline text-gold">PAIEMENT À LA LIVRAISON</span>
        </div>
      </div>

      {/* 2. MASTERPIECE EDITORIAL HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F3EA] via-cream to-[#F2EDE2] pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
        {/* Ambient atmospheric lighting */}
        <div className="pointer-events-none absolute top-10 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-gold/15 blur-[140px]" />
        <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-amber-200/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column: Poetic Headline & Actions */}
            <div className="flex flex-col items-start lg:col-span-7">
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-gold">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                <span>Haute Parfumerie & Parfums de Niche</span>
              </div>

              {/* Master Headline */}
              <h1 className="mt-6 font-heading text-4xl font-light tracking-tight text-stone-950 sm:text-6xl lg:text-7xl leading-[1.08]">
                L'Art du Sillage, <br />
                <span className="font-serif italic font-normal text-gold-dark">L'Excellence du Luxe.</span>
              </h1>

              {/* Sub-paragraph */}
              <p className="mt-6 max-w-xl text-base text-stone-600 sm:text-lg leading-relaxed font-normal">
                Découvrez une sélection confidentielle des plus prestigieuses maisons olfactives du monde. Flacons 100% authentiques, livrés avec distinction partout au Maroc.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto">
                <Link
                  href="/produits"
                  className="inline-flex h-13 items-center justify-center rounded-full bg-stone-950 px-8 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-stone-950/20 transition-all duration-300 hover:bg-gold hover:text-stone-950 hover:scale-105 active:scale-95 w-full sm:w-auto text-center"
                >
                  Explorer la Collection
                </Link>
                <Link
                  href="/produits?gender=UNISEXE"
                  className="inline-flex h-13 items-center justify-center rounded-full border border-stone-300/90 bg-white/80 px-8 text-xs font-bold uppercase tracking-[0.2em] text-stone-800 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-gold hover:text-gold-dark hover:bg-white hover:scale-105 active:scale-95 w-full sm:w-auto text-center"
                >
                  Parfums de Niche
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-stone-200/80 pt-6 w-full max-w-lg">
                <div>
                  <span className="block font-heading text-xl sm:text-2xl font-bold text-gold-dark">100%</span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">Authentique</span>
                </div>
                <div>
                  <span className="block font-heading text-xl sm:text-2xl font-bold text-gold-dark">24-48h</span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">Livraison Maroc</span>
                </div>
                <div>
                  <span className="block font-heading text-xl sm:text-2xl font-bold text-gold-dark">Paiement</span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">À la réception</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Spotlight Bottle Showcase */}
            <div className="relative flex items-center justify-center lg:col-span-5">
              {/* Outer decorative ring */}
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-3xl border border-gold/30 bg-gradient-to-tr from-amber-100/40 via-white/80 to-amber-50/50 p-6 shadow-2xl backdrop-blur-md">
                
                {/* Background aura */}
                <div className="absolute inset-4 rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/25 via-amber-50/20 to-transparent blur-xl" />

                {/* Hero Image */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <Image
                    src={heroProduct?.images?.[0] || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"}
                    alt={heroProduct?.name || "Parfum de Luxe"}
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 450px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                </div>

                {/* Floating Glassmorphic Details Card */}
                {heroProduct && (
                  <div className="absolute -bottom-6 left-4 right-4 sm:-left-6 sm:right-6 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-stone-900/10 backdrop-blur-lg">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark truncate">
                          {heroProduct.brand}
                        </span>
                        <h3 className="font-heading text-base font-semibold text-stone-950 truncate">
                          {heroProduct.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">
                            {heroProduct.variants?.[0]?.price
                              ? `${Number(heroProduct.variants[0].price).toLocaleString("fr-FR")} DH`
                              : "Prix sur demande"}
                          </span>
                          <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[9px] font-semibold text-gold-dark uppercase">
                            {heroProduct.concentration || "Eau de Parfum"}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/produits/${heroProduct.slug}`}
                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-gold px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-950 shadow-sm transition-all hover:bg-gold-light hover:scale-105 active:scale-95"
                      >
                        Découvrir
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRESTIGE HOUSES INFINITE SCROLL MARQUEE */}
      <section className="border-y border-stone-200/80 bg-white py-7 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
            Maisons & Créateurs d'Exception
          </span>
        </div>

        {/* Marquee Wrapper with Edge Fade Mask */}
        <div className="relative w-full overflow-hidden marquee-mask py-1">
          <div className="animate-marquee flex items-center gap-12 sm:gap-16">
            {/* Duplicated for seamless infinite loop */}
            {[...PRESTIGE_HOUSES, ...PRESTIGE_HOUSES].map((house, idx) => (
              <div key={`${house}-${idx}`} className="flex items-center gap-12 sm:gap-16 shrink-0">
                <Link
                  href={`/produits?brand=${encodeURIComponent(house)}`}
                  className="font-heading text-sm sm:text-base font-semibold tracking-[0.25em] text-stone-400/90 transition-all duration-300 hover:text-gold-dark hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  {house}
                </Link>
                <span className="text-gold/40 text-xs font-serif select-none">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OLFACTORY UNIVERSES / FAMILLES OLFACTIVES */}
      <section className="py-20 sm:py-28 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
                Univers Olfactifs
              </span>
              <h2 className="mt-2 font-heading text-3xl font-light text-stone-950 sm:text-5xl">
                Explorez par <span className="font-serif italic text-gold-dark font-normal">Famille de Sillage</span>
              </h2>
            </div>
            <p className="mt-4 md:mt-0 max-w-md text-xs sm:text-sm text-stone-600 leading-relaxed">
              Chaque essence raconte une émotion singulière. Choisissez votre univers olfactif selon votre personnalité et l'intensité désirée.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {OLFACTORY_UNIVERSES.map((universe) => (
              <Link
                key={universe.title}
                href={`/produits?${universe.filterParam}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition-all duration-500 hover:border-gold/60 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={universe.image}
                    alt={universe.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <span className="absolute top-4 left-4 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {universe.badge}
                  </span>

                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-light">
                      {universe.subtitle}
                    </span>
                    <h3 className="mt-1 font-heading text-xl font-bold tracking-wide text-white group-hover:text-gold-light transition-colors">
                      {universe.title}
                    </h3>
                    <p className="mt-2 text-xs text-stone-300 leading-relaxed line-clamp-2">
                      {universe.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar Action */}
                <div className="flex items-center justify-between border-t border-stone-100 bg-white px-5 py-3.5 text-xs font-semibold text-stone-800 transition-colors group-hover:text-gold-dark">
                  <span>Découvrir la sélection</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CHEFS-D'ŒUVRE / CURATED PRODUCT SPOTLIGHT WITH TABS */}
      <section className="py-20 sm:py-28 bg-white border-y border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
                Sélection Exclusive
              </span>
              <h2 className="mt-2 font-heading text-3xl font-light text-stone-950 sm:text-5xl">
                Les Parfums <span className="font-serif italic text-gold-dark font-normal">Iconiques</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-stone-200/80 bg-[#FAF7F2] p-1.5 text-xs">
              {[
                { id: "ALL", label: "Toute la Sélection" },
                { id: "HOMME", label: "Pour Homme" },
                { id: "FEMME", label: "Pour Femme" },
                { id: "UNISEXE", label: "Niche & Unisexe" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-full px-4 py-2 font-medium tracking-wide transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-stone-950 text-white font-bold shadow-xs"
                      : "text-stone-600 hover:text-stone-950 hover:bg-stone-200/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-[#FAF8F5] p-12 text-center">
              <p className="text-sm text-stone-500">Aucun parfum trouvé dans cette catégorie pour le moment.</p>
            </div>
          )}

          {/* Bottom View All Link */}
          <div className="mt-14 text-center">
            <Link
              href="/produits"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white px-10 text-xs font-bold uppercase tracking-[0.2em] text-stone-900 shadow-xs transition-all duration-300 hover:border-gold hover:bg-gold hover:text-stone-950 hover:scale-105 active:scale-95"
            >
              Voir tous les {allProducts.length > 0 ? allProducts.length : ""} parfums disponibles
            </Link>
          </div>
        </div>
      </section>

      {/* 6. THE SENSORY DISCOVERY: THE OLFACTORY PYRAMID */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-[#FAF7F2] to-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
              Guide Olfactif
            </span>
            <h2 className="mt-2 font-heading text-3xl font-light text-stone-950 sm:text-5xl">
              L'Architecture <span className="font-serif italic text-gold-dark font-normal">d'un Parfum</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Un parfum d'exception n'est pas statique : il évolue sur votre peau au fil des heures selon trois étapes d'évaporation harmonieuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stage 1: Top Notes */}
            <div className="relative rounded-2xl border border-stone-200/80 bg-white p-8 shadow-xs transition-all duration-300 hover:border-gold/50 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark font-heading font-bold text-lg mb-6">
                01
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark">0 à 15 Minutes</span>
              <h3 className="mt-1 font-heading text-xl font-bold text-stone-900">Notes de Tête</h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                L'envolée initiale qui captive dès la première vaporisation. Légères et fraîches (bergamote, agrumes, poivre rose, menthe), elles créent l'impression première.
              </p>
            </div>

            {/* Stage 2: Heart Notes */}
            <div className="relative rounded-2xl border border-gold/40 bg-gradient-to-b from-amber-50/40 to-white p-8 shadow-xs ring-1 ring-gold/20 transition-all duration-300 hover:border-gold hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-stone-950 font-heading font-bold text-lg mb-6 shadow-xs">
                02
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark">2 à 4 Heures</span>
              <h3 className="mt-1 font-heading text-xl font-bold text-stone-900">Notes de Cœur</h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                La véritable identité et l'âme du parfum. Plus enveloppantes et sensuelles (fleurs blanches, épices chaudes, lavande fine), elles signent votre présence.
              </p>
            </div>

            {/* Stage 3: Base Notes */}
            <div className="relative rounded-2xl border border-stone-200/80 bg-white p-8 shadow-xs transition-all duration-300 hover:border-gold/50 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark font-heading font-bold text-lg mb-6">
                03
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark">8 à 24 Heures</span>
              <h3 className="mt-1 font-heading text-xl font-bold text-stone-900">Notes de Fond</h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                L'empreinte indélébile et le sillage mémorable. Puissantes et tenaces (bois de oud, santal, vanille bourbon, musc), elles s'ancrent sur vos vêtements et votre peau.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THE HIMMEL EXPERIENCE & COMMITMENTS */}
      <section className="border-t border-stone-200/80 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
              L'Art du Service
            </span>
            <h2 className="mt-2 font-heading text-3xl font-light text-stone-950 sm:text-4xl">
              L'Expérience <span className="font-serif italic text-gold-dark font-normal">Himmel</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark mb-5 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="font-heading text-base font-bold text-stone-900 uppercase tracking-wide">Authenticité Certifiée</h3>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                Flacons neufs, scellés sous blister avec numéros de lot authentifiables et traçabilité garantie.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark mb-5 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.29-4.82c-.04-.661-.593-1.176-1.257-1.176H4.135m14.865 0H18.75a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125V3.375A3.375 3.375 0 009.75 0h-1.5L8.25 3.375a1.125 1.125 0 01-1.125 1.125v1.5a3.375 3.375 0 003.375 3.375h1.5a1.125 1.125 0 011.125 1.125v1.5" />
                </svg>
              </div>
              <h3 className="font-heading text-base font-bold text-stone-900 uppercase tracking-wide">Livraison Express Maroc</h3>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                Expédition prioritaire et soignée à Casablanca, Rabat, Marrakech, Tanger et toutes les villes du Royaume.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark mb-5 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="font-heading text-base font-bold text-stone-900 uppercase tracking-wide">Échantillons Offerts</h3>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                2 doses d'essai de nos nouveautés glissées délicatement dans chaque paquet pour vos futures découvertes.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark mb-5 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m-.007 3h.007m15 0h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008zm0-3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="font-heading text-base font-bold text-stone-900 uppercase tracking-wide">Paiement à Réception</h3>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                Réglez en toute sérénité en espèces lors de la remise de votre colis par notre transporteur partenaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHATSAPP CONCIERGE & PRIVATE VIP CALLOUT */}
      <section className="bg-stone-950 py-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12 backdrop-blur-md">
            <div className="max-w-xl text-center lg:text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Service Conciergerie Personnalisé
              </span>
              <h2 className="mt-2 font-heading text-3xl font-light sm:text-4xl text-white">
                Besoin d'un conseil pour votre <span className="font-serif italic text-gold font-normal">prochain sillage ?</span>
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-stone-400 leading-relaxed">
                Notre conseiller olfactif est à votre écoute pour vous guider selon vos préférences, la saison ou une occasion spéciale.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="https://wa.me/212600000000?text=Bonjour,%20je%20souhaite%20un%20conseil%20pour%20choisir%20un%20parfum%20sur%20Himmel."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-950/40 transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                </svg>
                Conseil WhatsApp Direct
              </a>
              <Link
                href="/produits"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white hover:text-stone-950 hover:scale-105 active:scale-95"
              >
                Parcourir la Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
