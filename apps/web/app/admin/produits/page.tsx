"use client";

import Link from "next/link";
import { useState } from "react";
import { trpcReact } from "@/lib/trpc-client";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const limit = 8;

  // tRPC query to list all products including inactive ones
  const { data: productsData, refetch, isLoading } = trpcReact.product.list.useQuery({
    page,
    limit,
    includeInactive: true,
  });

  // tRPC deletion mutation
  const deleteMutation = trpcReact.product.delete.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      refetch();
    },
    onError: (err) => {
      alert(err.message || "Erreur de suppression.");
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) {
      deleteMutation.mutate({ id });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Tous les produits</h1>
          <p className="text-xs text-zinc-500 mt-1">Créez, modifiez ou désactivez les parfums de votre catalogue</p>
        </div>
        <Link
          href="/admin/produits/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:scale-105"
        >
          + Ajouter un produit
        </Link>
      </div>

      {/* Table grid */}
      {productsData?.products && productsData.products.length > 0 ? (
        <div className="rounded-xl border border-white/5 bg-zinc-950/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-300 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Produit</th>
                  <th className="px-6 py-4">Marque</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Variantes</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {productsData.products.map((p) => {
                  const minPrice = p.variants.length > 0
                    ? Math.min(...p.variants.map((v) => Number(v.price)))
                    : 0;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/20">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">{p.concentration || "Parfum"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{p.brand}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs text-zinc-400">
                          {getGenderLabel(p.gender)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-300 font-medium">
                          {p.variants.length} taille(s)
                        </span>
                        <span className="text-xs text-zinc-500 block">
                          À partir de {minPrice.toLocaleString("fr-FR")} DH
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            p.active
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {p.active ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex gap-3 justify-end">
                        <Link
                          href={`/admin/produits/${p.id}/edit`}
                          className="text-xs font-semibold text-gold hover:text-gold-light transition-colors"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {productsData.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
              <span className="text-xs text-zinc-500">
                Page {page} sur {productsData.totalPages} ({productsData.totalCount} produits)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold border border-zinc-800 disabled:opacity-50 text-zinc-300"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, productsData.totalPages))}
                  disabled={page === productsData.totalPages}
                  className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold border border-zinc-800 disabled:opacity-50 text-zinc-300"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <p className="text-zinc-500">Aucun produit dans votre boutique pour le moment.</p>
        </div>
      )}
    </div>
  );
}
