"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import BrandLogo from "@/components/common/BrandLogo";

const navLinks = [
  { href: "/", label: "Accueil", isActive: (pathname: string) => pathname === "/" },
  {
    href: "/produits",
    label: "Parfums",
    isActive: (pathname: string) => pathname.startsWith("/produits"),
  },
  {
    href: "/produits?gender=HOMME",
    label: "Homme",
    isActive: () => false,
  },
  {
    href: "/produits?gender=FEMME",
    label: "Femme",
    isActive: () => false,
  },
] as const;

function NavLink({
  href,
  label,
  active,
  onNavigate,
  className = "",
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`text-sm font-medium tracking-wide transition-colors hover:text-gold-dark ${
        active ? "text-gold-dark font-semibold" : "text-stone-600"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-cream/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-8">
        {/* Logo + desktop nav */}
        <div className="flex min-w-0 items-center gap-6 md:gap-8">
          <BrandLogo />
        </div>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={link.isActive(pathname)}
            />
          ))}
        </nav>
        {/* Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Customer Auth Link (Desktop) */}
          {status === "authenticated" ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/compte"
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-800 shadow-2xs hover:border-gold hover:text-gold-dark transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gold-dark">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>Mon Compte</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/connexion"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-gold-dark transition-colors px-2 py-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>Connexion</span>
            </Link>
          )}

          {/* Wishlist Button */}
          <Link
            href="/favoris"
            className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-sm transition-all duration-300 hover:border-gold hover:bg-rose-50/40 sm:h-10 sm:w-10"
            aria-label={`Favoris${mounted && wishlistCount > 0 ? `, ${wishlistCount} produit${wishlistCount > 1 ? "s" : ""}` : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 transition-colors group-hover:text-rose-600"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            {mounted && wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-in fade-in zoom-in duration-200">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            href="/panier"
            className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-sm transition-all duration-300 hover:border-gold hover:bg-amber-50/50 sm:h-10 sm:w-10"
            aria-label={`Panier${mounted && itemCount > 0 ? `, ${itemCount} article${itemCount > 1 ? "s" : ""}` : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 transition-colors group-hover:text-gold-dark"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {mounted && itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-stone-950 ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition-colors hover:border-gold hover:text-gold-dark md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-stone-200/80 bg-cream/98 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-[calc(100dvh-4rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-8" aria-label="Navigation mobile">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={link.isActive(pathname)}
              onNavigate={closeMenu}
              className="border-b border-stone-200/60 py-3.5 text-base"
            />
          ))}

          <Link
            href="/favoris"
            onClick={closeMenu}
            className="border-b border-stone-200/60 py-3.5 text-sm font-semibold text-stone-900 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-rose-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Mes Favoris
            </span>
            {mounted && wishlistCount > 0 && (
              <span className="rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-xs font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {status === "authenticated" ? (
            <>
              <Link
                href="/compte"
                onClick={closeMenu}
                className="border-b border-stone-200/60 py-3.5 text-sm font-semibold text-stone-900 flex items-center justify-between"
              >
                <span>Mon Compte & Mes Commandes</span>
                <span className="text-gold-dark">&rarr;</span>
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: "/" });
                }}
                className="py-3.5 text-left text-sm font-semibold text-rose-600"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <Link
              href="/connexion"
              onClick={closeMenu}
              className="border-b border-stone-200/60 py-3.5 text-sm font-semibold text-stone-900 flex items-center justify-between"
            >
              <span>Se connecter / S'inscrire</span>
              <span className="text-gold-dark">&rarr;</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

