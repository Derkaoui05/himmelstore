"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold tracking-widest text-gold hover:text-gold-light transition-colors">
              HIMMEL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium tracking-wide transition-colors hover:text-gold ${
                pathname === "/" ? "text-gold" : "text-zinc-400"
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/produits"
              className={`text-sm font-medium tracking-wide transition-colors hover:text-gold ${
                pathname.startsWith("/produits") ? "text-gold" : "text-zinc-400"
              }`}
            >
              Parfums
            </Link>
            <Link
              href="/produits?gender=HOMME"
              className="text-sm font-medium tracking-wide text-zinc-400 transition-colors hover:text-gold"
            >
              Homme
            </Link>
            <Link
              href="/produits?gender=FEMME"
              className="text-sm font-medium tracking-wide text-zinc-400 transition-colors hover:text-gold"
            >
              Femme
            </Link>
          </nav>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-6">
          {/* Admin link */}
          <Link
            href="/admin/dashboard"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-gold transition-colors hidden sm:block"
          >
            Admin
          </Link>

          {/* Cart Icon */}
          <Link
            href="/panier"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-white transition-all duration-300 hover:border-gold hover:bg-zinc-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 group-hover:text-gold transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {mounted && itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black ring-2 ring-black">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
