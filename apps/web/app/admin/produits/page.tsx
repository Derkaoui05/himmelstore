"use client";

import Link from "next/link";
import { useState } from "react";
import { trpcReact } from "@/lib/trpc-client";
import { useAdminThemeStore, THEME_CONFIGS } from "@/lib/adminThemeStore";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { theme } = useAdminThemeStore();
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.cream;
  const isDark = theme !== "cream";

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  // tRPC query to list all products including inactive ones
  const { data: productsData, refetch, isLoading } = trpcReact.product.list.useQuery({
    page,
    limit,
    includeInactive: true,
  });

  // tRPC deletion mutation
  const deleteMutation = trpcReact.product.delete.useMutation({
    onSuccess: (data) => {
      setNotification({ type: "success", message: data.message });
      setProductToDelete(null);
      refetch();
    },
    onError: (err) => {
      setNotification({ type: "error", message: err.message || "Erreur de suppression." });
      setProductToDelete(null);
    },
  });

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate({ id: productToDelete.id });
    }
  };

  const getGenderLabel = (g: string) => {
    const labels: Record<string, string> = { HOMME: "Homme", FEMME: "Femme", UNISEXE: "Unisexe" };
    return labels[g] || g;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-xl font-bold font-heading ${themeConfig.textPrimary}`}>Tous les produits</h1>
          <p className={`text-xs mt-1 ${themeConfig.textSecondary}`}>
            Créez, modifiez ou supprimez les parfums de votre catalogue
          </p>
        </div>
        <Link
          href="/admin/produits/new"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-gold px-6 text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-sm transition-all hover:bg-gold-light hover:scale-105 active:scale-95"
        >
          + Ajouter un produit
        </Link>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-start justify-between gap-3 ${
            notification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-600"
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="cursor-pointer shrink-0 text-stone-400 hover:text-stone-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Table grid */}
      {productsData?.products && productsData.products.length > 0 ? (
        <div className={`rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} shadow-xs overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary} border-b ${themeConfig.border} ${isDark ? "bg-slate-900/50" : "bg-[#FAF8F5]"}`}>
                <tr>
                  <th className="px-6 py-4">Produit</th>
                  <th className="px-6 py-4">Marque</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Variantes</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${themeConfig.border}`}>
                {productsData.products.map((p) => {
                  const minPrice = p.variants.length > 0
                    ? Math.min(...p.variants.map((v) => Number(v.price)))
                    : 0;

                  return (
                    <tr
                      key={p.id}
                      className={`${isDark ? "hover:bg-slate-800/30" : "hover:bg-stone-50/80"} transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-semibold ${themeConfig.textPrimary}`}>{p.name}</span>
                          <span className={`text-[10px] mt-0.5 ${themeConfig.textSecondary}`}>{p.concentration || "Parfum"}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${themeConfig.textSecondary}`}>{p.brand}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs ${
                          isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-stone-100 border-stone-200 text-stone-600"
                        }`}>
                          {getGenderLabel(p.gender)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${themeConfig.textPrimary}`}>
                          {p.variants.length} taille(s)
                        </span>
                        <span className={`text-xs block ${themeConfig.textSecondary}`}>
                          À partir de {minPrice.toLocaleString("fr-FR")} DH
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            p.active
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                          }`}
                        >
                          {p.active ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/produits/${p.id}/edit`}
                            className="text-xs font-semibold text-gold-dark hover:text-gold transition-colors"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => setProductToDelete({ id: p.id, name: p.name })}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {productsData.totalPages > 1 && (
            <div className={`flex items-center justify-between border-t ${themeConfig.border} px-6 py-4`}>
              <span className={`text-xs ${themeConfig.textSecondary}`}>
                Page {page} sur {productsData.totalPages} ({productsData.totalCount} produits)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border ${themeConfig.border} disabled:opacity-40 transition-colors cursor-pointer ${
                    isDark ? "bg-slate-900 text-slate-300 hover:bg-slate-800" : "bg-white text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, productsData.totalPages))}
                  disabled={page === productsData.totalPages}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border ${themeConfig.border} disabled:opacity-40 transition-colors cursor-pointer ${
                    isDark ? "bg-slate-900 text-slate-300 hover:bg-slate-800" : "bg-white text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`text-center py-12 border border-dashed ${themeConfig.border} rounded-2xl ${themeConfig.bgCard} shadow-xs`}>
          <p className={themeConfig.textSecondary}>Aucun produit dans votre boutique pour le moment.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`w-full max-w-md rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <div>
                <h3 className={`text-base font-bold ${themeConfig.textPrimary}`}>Supprimer ce produit ?</h3>
                <p className={`text-xs ${themeConfig.textSecondary}`}>
                  {productToDelete.name}
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${themeConfig.textSecondary}`}>
              Si toutes les commandes associées à ce parfum sont déjà livrées ou annulées, le produit sera définitivement supprimé. S'il existe des commandes en cours, la suppression sera bloquée.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleteMutation.isPending}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border ${themeConfig.border} ${
                  isDark ? "bg-slate-900 text-slate-300 hover:bg-slate-800" : "bg-white text-stone-700 hover:bg-stone-100"
                } transition-colors cursor-pointer`}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <span>Confirmer la suppression</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
