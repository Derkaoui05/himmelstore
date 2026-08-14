"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useState, useEffect, useCallback } from "react";

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
      className={`text-sm font-medium tracking-wide transition-colors hover:text-gold ${
        active ? "text-gold" : "text-zinc-400"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-8">
        {/* Logo + desktop nav */}
        <div className="flex min-w-0 items-center gap-6 md:gap-8">
          <Link href="/" className="shrink-0">
            <span className="font-heading text-xl font-bold tracking-widest text-gold transition-colors hover:text-gold-light sm:text-2xl">
              HIMMEL
            </span>
          </Link>

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
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/admin/dashboard"
            className="hidden text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-gold sm:block"
          >
            Admin
          </Link>

          <Link
            href="/panier"
            className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-white transition-all duration-300 hover:border-gold hover:bg-zinc-900 sm:h-10 sm:w-10"
            aria-label={`Panier${mounted && itemCount > 0 ? `, ${itemCount} article${itemCount > 1 ? "s" : ""}` : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 transition-colors group-hover:text-gold"
              aria-hidden="true"
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

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 transition-colors hover:border-gold hover:text-gold md:hidden"
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
        className={`overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-in-out md:hidden ${
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
              className="border-b border-white/5 py-4 text-base last:border-b-0"
            />
          ))}
          <Link
            href="/admin/dashboard"
            onClick={closeMenu}
            className="mt-2 border-t border-white/5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-gold"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
