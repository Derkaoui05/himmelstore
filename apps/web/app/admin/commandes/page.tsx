"use client";

import { useState } from "react";
import { trpcReact } from "@/lib/trpc-client";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const limit = 8;

  // tRPC query to list all orders
  const { data: ordersData, refetch, isLoading } = trpcReact.order.list.useQuery({
    page,
    limit,
    status: statusFilter ? (statusFilter as any) : undefined,
  });

  // tRPC update status mutation
  const updateStatusMutation = trpcReact.order.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      alert(err.message || "Erreur lors de la mise à jour du statut.");
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({
      orderId,
      status: newStatus as any,
    });
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: "En Attente", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    CONFIRMED: { label: "Confirmée", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    SHIPPED: { label: "Expédiée", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    DELIVERED: { label: "Livrée", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    CANCELLED: { label: "Annulée", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
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
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Gestion des Commandes</h1>
          <p className="text-xs text-zinc-500 mt-1">Gérez le traitement, la livraison et le statut des commandes clients</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Filtrer par :</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(statusLabels).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Grid/Table */}
      {ordersData?.orders && ordersData.orders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {ordersData.orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col md:flex-row md:justify-between gap-6 hover:border-zinc-800 transition-all"
            >
              {/* Left Column: Order info, Customer details */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gold tracking-wide">{order.orderNumber}</span>
                  <span className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Customer Address Card */}
                <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  <p className="text-white font-semibold text-sm">{order.customerName}</p>
                  <p className="mt-1">Tél: <span className="text-zinc-300 font-medium">{order.phone}</span></p>
                  <p>Ville: <span className="text-zinc-300">{order.city}</span></p>
                  <p className="line-clamp-2">Adresse: <span className="text-zinc-300">{order.address}</span></p>
                  {order.notes && (
                    <p className="mt-2 rounded bg-zinc-900/60 p-2 text-zinc-500 italic">
                      Note client: {order.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Middle Column: Items purchased */}
              <div className="grow md:grow-0 md:w-80 flex flex-col gap-2 border-t md:border-t-0 md:border-x border-white/5 pt-4 md:pt-0 md:px-6">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Articles commandés</span>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-zinc-300 truncate max-w-45">
                        {item.variant.product.name} ({item.variant.size})
                      </span>
                      <div className="flex gap-4">
                        <span className="text-zinc-500">x{item.quantity}</span>
                        <span className="text-gold font-semibold">{(Number(item.price) * item.quantity).toLocaleString("fr-FR")} DH</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 mt-auto pt-2 flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Total à payer</span>
                  <span className="text-sm font-bold text-gold">{Number(order.total).toLocaleString("fr-FR")} DH</span>
                </div>
              </div>

              {/* Right Column: Update Status */}
              <div className="flex flex-col justify-between items-start md:items-end gap-4 min-w-37.5">
                {/* Current Status Badge */}
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    statusLabels[order.status]?.color || "bg-zinc-900 text-zinc-400"
                  }`}
                >
                  {statusLabels[order.status]?.label || order.status}
                </span>

                {/* Dropdown status update */}
                <div className="w-full flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Changer le statut :</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  >
                    {Object.entries(statusLabels).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {ordersData.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 px-6 py-4 mt-4">
              <span className="text-xs text-zinc-500">
                Page {page} sur {ordersData.totalPages} ({ordersData.totalCount} commandes)
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
                  onClick={() => setPage((p) => Math.min(p + 1, ordersData.totalPages))}
                  disabled={page === ordersData.totalPages}
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
          <p className="text-zinc-500">Aucune commande trouvée.</p>
        </div>
      )}
    </div>
  );
}
