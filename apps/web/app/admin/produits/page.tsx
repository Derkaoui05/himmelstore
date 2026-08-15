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
          <h1 className="text-xl font-bold text-stone-900">Tous les produits</h1>
          <p className="text-xs text-stone-500 mt-1">Créez, modifiez ou désactivez les parfums de votre catalogue</p>
        </div>
        <Link
          href="/admin/produits/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-sm transition-all hover:bg-gold-light hover:scale-105"
        >
          + Ajouter un produit
        </Link>
      </div>

      {/* Table grid */}
      {productsData?.products && productsData.products.length > 0 ? (
        <div className="rounded-xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider text-stone-700 border-b border-stone-200/80">
                <tr>
                  <th className="px-6 py-4">Produit</th>
                  <th className="px-6 py-4">Marque</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Variantes</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {productsData.products.map((p) => {
                  const minPrice = p.variants.length > 0
                    ? Math.min(...p.variants.map((v) => Number(v.price)))
                    : 0;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-900">{p.name}</span>
                          <span className="text-[10px] text-stone-500 mt-0.5">{p.concentration || "Parfum"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-700">{p.brand}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-xs text-stone-600">
                          {getGenderLabel(p.gender)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-stone-800 font-medium">
                          {p.variants.length} taille(s)
                        </span>
                        <span className="text-xs text-stone-500 block">
                          À partir de {minPrice.toLocaleString("fr-FR")} DH
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            p.active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {p.active ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex gap-3 justify-end">
                        <Link
                          href={`/admin/produits/${p.id}/edit`}
                          className="text-xs font-semibold text-gold-dark hover:text-gold transition-colors"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
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
            <div className="flex items-center justify-between border-t border-stone-200/80 px-6 py-4">
              <span className="text-xs text-stone-500">
                Page {page} sur {productsData.totalPages} ({productsData.totalCount} produits)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold border border-stone-200 shadow-2xs disabled:opacity-50 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, productsData.totalPages))}
                  disabled={page === productsData.totalPages}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold border border-stone-200 shadow-2xs disabled:opacity-50 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-stone-200 rounded-xl bg-white shadow-xs">
          <p className="text-stone-500">Aucun produit dans votre boutique pour le moment.</p>
        </div>
      )}
    </div>
  );
}
