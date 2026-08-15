"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the login page, don't show the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { label: "Tableau de Bord", href: "/admin/dashboard" },
    { label: "Produits", href: "/admin/produits" },
    { label: "Commandes", href: "/admin/commandes" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F6F0] text-stone-900">
      {/* Sidebar */}
      <aside className="w-72 border-r border-stone-200/80 bg-white flex flex-col justify-between shadow-xs shrink-0">
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
        {/* Top Header */}
        <header className="h-20 border-b border-stone-200/80 bg-white/80 flex items-center justify-between px-8 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-stone-900">
            {pathname === "/admin/dashboard"
              ? "Tableau de Bord"
              : pathname.startsWith("/admin/produits")
              ? "Gestion des Produits"
              : pathname.startsWith("/admin/commandes")
              ? "Gestion des Commandes"
              : "Administration"}
          </h2>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-gold-dark transition-colors"
          >
            Visiter la boutique &rarr;
          </Link>
        </header>

        {/* Content Page */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
