"use client";

import { useState, useEffect } from "react";
import { trpcReact } from "@/lib/trpc-client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: stats, isLoading } = trpcReact.admin.dashboardStats.useQuery(
    { days },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || !mounted) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  const summary = stats?.summary || {
    totalRevenue: 0,
    totalOrdersCount: 0,
    activeOrdersCount: 0,
    cancelledOrdersCount: 0,
    lowStockAlertsCount: 0,
  };

  const averageOrderValue =
    summary.activeOrdersCount > 0
      ? summary.totalRevenue / summary.activeOrdersCount
      : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Vue d'ensemble</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Indicateurs de performance de votre boutique pour les derniers {days} jours
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
        >
          <option value={7}>7 Derniers Jours</option>
          <option value={30}>30 Derniers Jours</option>
          <option value={90}>90 Derniers Jours</option>
        </select>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric: Revenue */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Chiffre d'Affaires</span>
          <span className="text-2xl font-bold text-gold">
            {summary.totalRevenue.toLocaleString("fr-FR")} DH
          </span>
          <span className="text-[10px] text-zinc-600">Commandes confirmées</span>
        </div>

        {/* Metric: Orders count */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Commandes Actives</span>
          <span className="text-2xl font-bold text-white">{summary.activeOrdersCount}</span>
          <span className="text-[10px] text-zinc-600">Excluant les commandes annulées</span>
        </div>

        {/* Metric: Avg order value */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Panier Moyen</span>
          <span className="text-2xl font-bold text-white">
            {averageOrderValue.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} DH
          </span>
          <span className="text-[10px] text-zinc-600">Total revenus / Commandes</span>
        </div>

        {/* Metric: Low stock */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Alertes de Stock</span>
          <span
            className={`text-2xl font-bold ${
              summary.lowStockAlertsCount > 0 ? "text-rose-500" : "text-emerald-500"
            }`}
          >
            {summary.lowStockAlertsCount}
          </span>
          <span className="text-[10px] text-zinc-600">Variantes avec stock &le; 5</span>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue over time */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Évolution des Ventes (DH)</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Revenus générés par jour</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.dailyChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tickLine={false} />
                <YAxis stroke="#666" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#121212", borderColor: "#333", color: "#fff" }}
                  formatter={(value: any) => [`${value.toLocaleString()} DH`, "Chiffre d'affaires"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A96E" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Orders count */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Commandes par Jour</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Nombre de commandes validées par jour</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.dailyChartData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tickLine={false} />
                <YAxis stroke="#666" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#121212", borderColor: "#333", color: "#fff" }}
                  formatter={(value: any) => [value, "Commandes"]}
                />
                <Bar dataKey="orders" fill="#B8944F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Top selling & Low stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top selling products table */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Produits les plus vendus</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Top 5 par volume de vente</p>
          </div>
          {stats?.topProducts && stats.topProducts.length > 0 ? (
            <div className="flex flex-col divide-y divide-white/5">
              {stats.topProducts.map((p, index) => (
                <div key={p.id} className="flex justify-between items-center py-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-bold w-4">#{index + 1}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">{p.brand}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-zinc-400 font-medium">{p.quantity} unités</span>
                    <span className="text-gold font-bold">{p.revenue.toLocaleString("fr-FR")} DH</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-6 text-center">Aucune vente enregistrée.</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Alerte Stocks Critiques</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Variantes de parfum nécessitant un réapprovisionnement</p>
          </div>
          {stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 ? (
            <div className="flex flex-col divide-y divide-white/5">
              {stats.lowStockAlerts.map((item) => (
                <div key={item.variantId} className="flex justify-between items-center py-3 text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {item.productName} ({item.size})
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      SKU: {item.sku} &bull; {item.brand}
                    </span>
                  </div>
                  <span
                    className={`rounded px-2.5 py-0.5 text-xs font-semibold ${
                      item.stock === 0 ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {item.stock === 0 ? "En Rupture" : `${item.stock} restants`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-500 py-6 text-center">
              ✓ Tous vos stocks sont à des niveaux optimaux.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
