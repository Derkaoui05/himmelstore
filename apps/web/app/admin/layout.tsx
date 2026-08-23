"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useAdminThemeStore, THEME_CONFIGS } from "@/lib/adminThemeStore";
import BrandLogo from "@/components/common/BrandLogo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useAdminThemeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu whenever navigation path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If we are on the login page, don't show the sidebar or navbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const activeThemeConfig = mounted ? THEME_CONFIGS[theme] || THEME_CONFIGS.cream : THEME_CONFIGS.cream;
  const isDark = theme !== "cream";

  const menuItems = [
    {
      label: "Tableau de Bord",
      href: "/admin/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      label: "Produits",
      href: "/admin/produits",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
    },
    {
      label: "Commandes",
      href: "/admin/commandes",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
    },
    {
      label: "Admins",
      href: "/admin/utilisateurs",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: "Thème & Paramètres",
      href: "/admin/parametres",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return "Tableau de Bord";
    if (pathname.startsWith("/admin/produits")) return "Gestion des Produits";
    if (pathname.startsWith("/admin/commandes")) return "Gestion des Commandes";
    if (pathname.startsWith("/admin/utilisateurs")) return "Gestion des Administrateurs";
    if (pathname.startsWith("/admin/parametres")) return "Thème & Paramètres";
    return "Administration";
  };

  return (
    <div className={`flex min-h-screen flex-col md:flex-row ${activeThemeConfig.bgMain} ${activeThemeConfig.textPrimary} transition-colors duration-300`}>
      {/* Mobile Top Navbar (Visible on small screens) */}
      <header className={`sticky top-0 z-40 flex flex-col border-b ${activeThemeConfig.border} ${isDark ? "bg-[#1c2541]/95" : "bg-white/95"} backdrop-blur-md shadow-xs md:hidden`}>
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <BrandLogo isDark={isDark} />

          {/* Right Action: Storefront Link & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] font-semibold uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
            >
              Boutique &rarr;
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${activeThemeConfig.border} ${isDark ? "bg-slate-800 text-slate-200" : "bg-stone-50 text-stone-700"} transition-colors cursor-pointer`}
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
          <div className={`flex flex-col gap-1 border-t ${activeThemeConfig.border} p-4 ${isDark ? "bg-[#1c2541]" : "bg-white"} animate-in slide-in-from-top-2 duration-200`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeThemeConfig.textSecondary} px-3 py-1`}>
              Navigation Admin
            </span>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? `${activeThemeConfig.accent} font-semibold shadow-xs`
                      : `${activeThemeConfig.textSecondary} ${isDark ? "hover:bg-slate-800/60 hover:text-white" : "hover:bg-stone-100 hover:text-stone-950"}`
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            <div className={`mt-2 pt-2 border-t ${activeThemeConfig.border}`}>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className={`hidden md:flex w-72 ${activeThemeConfig.bgSidebar} flex-col justify-between shadow-xs shrink-0 transition-colors duration-300`}>
        <div>
          {/* Logo */}
          <div className={`h-24 mt-4 flex flex-col items-center justify-center px-8 border-b ${activeThemeConfig.border}`}>
            <BrandLogo isDark={isDark} />
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col gap-1.5 px-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? `${activeThemeConfig.accent} font-semibold shadow-xs`
                      : `${activeThemeConfig.textSecondary} ${isDark ? "hover:bg-slate-800/60 hover:text-white" : "hover:bg-stone-100 hover:text-stone-900"}`
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className={`p-4 border-t ${activeThemeConfig.border} flex flex-col gap-2`}>
          <div className="px-3 py-1.5 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs uppercase border border-gold/40">
              {(session?.user?.name || "A")[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-semibold ${activeThemeConfig.textPrimary} truncate`}>
                {session?.user?.name || "Administrateur"}
              </span>
              <span className={`text-[10px] ${activeThemeConfig.textSecondary} truncate`}>
                {session?.user?.email || "himmelcontact26@gmail.com"}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide ${activeThemeConfig.textSecondary} hover:bg-rose-500/10 hover:text-rose-500 transition-all cursor-pointer`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="grow flex flex-col min-w-0">
        {/* Desktop Top Header (Hidden on mobile) */}
        <header className={`hidden md:flex h-20 border-b ${activeThemeConfig.border} ${isDark ? "bg-[#1c2541]/80" : "bg-white/80"} items-center justify-between px-8 backdrop-blur-md transition-colors duration-300`}>
          <h2 className={`text-lg font-semibold ${activeThemeConfig.textPrimary}`}>
            {getPageTitle()}
          </h2>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-light transition-colors flex items-center gap-1.5"
          >
            <span>Visiter la boutique</span>
            <span>&rarr;</span>
          </Link>
        </header>

        {/* Content Page */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
