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
      <div className="flex justify-between items-center border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Vue d'ensemble</h1>
          <p className="text-xs text-stone-500 mt-1">
            Indicateurs de performance de votre boutique pour les derniers {days} jours
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 focus:border-gold focus:outline-none shadow-2xs cursor-pointer"
        >
          <option value={7}>7 Derniers Jours</option>
          <option value={30}>30 Derniers Jours</option>
          <option value={90}>90 Derniers Jours</option>
        </select>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric: Revenue */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col gap-2 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Chiffre d'Affaires</span>
          <span className="text-2xl font-bold text-gold-dark">
            {summary.totalRevenue.toLocaleString("fr-FR")} DH
          </span>
          <span className="text-[10px] text-stone-400">Commandes confirmées</span>
        </div>

        {/* Metric: Orders count */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col gap-2 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Commandes Actives</span>
          <span className="text-2xl font-bold text-stone-900">{summary.activeOrdersCount}</span>
          <span className="text-[10px] text-stone-400">Excluant les commandes annulées</span>
        </div>

        {/* Metric: Avg order value */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col gap-2 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Panier Moyen</span>
          <span className="text-2xl font-bold text-stone-900">
            {averageOrderValue.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} DH
          </span>
          <span className="text-[10px] text-stone-400">Total revenus / Commandes</span>
        </div>

        {/* Metric: Low stock */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col gap-2 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Alertes de Stock</span>
          <span
            className={`text-2xl font-bold ${
              summary.lowStockAlertsCount > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {summary.lowStockAlertsCount}
          </span>
          <span className="text-[10px] text-stone-400">Variantes avec stock &le; 5</span>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue over time */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col gap-4 shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Évolution des Ventes (DH)</h3>
            <p className="text-[10px] text-stone-500 mt-0.5">Revenus générés par jour</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.dailyChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A96E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E8E2D6" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#78716C" tickLine={false} />
                <YAxis stroke="#78716C" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E8E2D6", color: "#1C1917", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: any) => [`${value.toLocaleString()} DH`, "Chiffre d'affaires"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#B8944F" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Orders count */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col gap-4 shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Commandes par Jour</h3>
            <p className="text-[10px] text-stone-500 mt-0.5">Nombre de commandes validées par jour</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.dailyChartData}>
                <CartesianGrid stroke="#E8E2D6" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#78716C" tickLine={false} />
                <YAxis stroke="#78716C" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E8E2D6", color: "#1C1917", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: any) => [value, "Commandes"]}
                />
                <Bar dataKey="orders" fill="#C9A96E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Top selling & Low stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top selling products table */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col gap-4 shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Produits les plus vendus</h3>
            <p className="text-[10px] text-stone-500 mt-0.5">Top 5 par volume de vente</p>
          </div>
          {stats?.topProducts && stats.topProducts.length > 0 ? (
            <div className="flex flex-col divide-y divide-stone-100">
              {stats.topProducts.map((p, index) => (
                <div key={p.id} className="flex justify-between items-center py-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-stone-400 font-bold w-4">#{index + 1}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-stone-900">{p.name}</span>
                      <span className="text-[10px] text-stone-500 mt-0.5">{p.brand}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-stone-600 font-medium">{p.quantity} unités</span>
                    <span className="text-gold-dark font-bold">{p.revenue.toLocaleString("fr-FR")} DH</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center">Aucune vente enregistrée.</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col gap-4 shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Alerte Stocks Critiques</h3>
            <p className="text-[10px] text-stone-500 mt-0.5">Variantes de parfum nécessitant un réapprovisionnement</p>
          </div>
          {stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 ? (
            <div className="flex flex-col divide-y divide-stone-100">
              {stats.lowStockAlerts.map((item) => (
                <div key={item.variantId} className="flex justify-between items-center py-3 text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-stone-900">
                      {item.productName} ({item.size})
                    </span>
                    <span className="text-[10px] text-stone-500 mt-0.5">
                      SKU: {item.sku} &bull; {item.brand}
                    </span>
                  </div>
                  <span
                    className={`rounded px-2.5 py-0.5 text-xs font-semibold ${
                      item.stock === 0 ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {item.stock === 0 ? "En Rupture" : `${item.stock} restants`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-600 py-6 text-center">
              ✓ Tous vos stocks sont à des niveaux optimaux.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
