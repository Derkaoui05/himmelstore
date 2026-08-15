"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu whenever navigation path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If we are on the login page, don't show the sidebar or navbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { label: "Tableau de Bord", href: "/admin/dashboard" },
    { label: "Produits", href: "/admin/produits" },
    { label: "Commandes", href: "/admin/commandes" },
  ];

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return "Tableau de Bord";
    if (pathname.startsWith("/admin/produits")) return "Gestion des Produits";
    if (pathname.startsWith("/admin/commandes")) return "Gestion des Commandes";
    return "Administration";
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#F8F6F0] text-stone-900">
      {/* Mobile Top Navbar (Visible on small screens) */}
      <header className="sticky top-0 z-40 flex flex-col border-b border-stone-200/80 bg-white/95 backdrop-blur-md shadow-xs md:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-widest text-gold-dark hover:text-gold transition-colors">
              HIMMEL
            </span>
            <span className="font-semibold text-[10px] uppercase text-black ml-4 tracking-wider">
              fatima zahrae derkaoui
            </span>
          </Link>

          {/* Right Action: Storefront Link & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 hover:text-gold-dark transition-colors"
            >
              Boutique &rarr;
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Navigation Menu */}
        {mobileMenuOpen && (
          <div className="flex flex-col gap-1 border-t border-stone-100 p-4 bg-white animate-in slide-in-from-top-2 duration-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
              Navigation Admin
            </span>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? "bg-gold text-stone-950 font-semibold shadow-xs"
                      : "text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden md:flex w-72 border-r border-stone-200/80 bg-white flex-col justify-between shadow-xs shrink-0">
        <div>
          {/* Logo */}
          <div className="h-24 mt-4 flex flex-col items-center px-8 border-b border-stone-100">
            <Link href="/" className="flex flex-col w-full">
              <span className="font-heading text-xl font-bold tracking-widest text-gold-dark transition-colors hover:text-gold sm:text-2xl">
                HIMMEL
              </span>
              <span className="font-semibold text-xs uppercase text-black w-fit ml-8 tracking-wide">
                fatima zahrae derkaoui
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col gap-1.5 px-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? "bg-gold text-stone-950 font-semibold shadow-xs"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-stone-100">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium tracking-wide text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="grow flex flex-col min-w-0">
        {/* Desktop Top Header (Hidden on mobile as it's represented in the mobile navbar) */}
        <header className="hidden md:flex h-20 border-b border-stone-200/80 bg-white/80 items-center justify-between px-8 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-stone-900">
            {getPageTitle()}
          </h2>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-gold-dark transition-colors"
          >
            Visiter la boutique &rarr;
          </Link>
        </header>

        {/* Content Page (Rendered below navbar on mobile, or next to sidebar on desktop) */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
