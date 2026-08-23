"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { trpcReact } from "@/lib/trpc-client";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCustomerProfileSchema, type UpdateCustomerProfile } from "@himmel/types";

export default function AccountPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/connexion?callbackUrl=/compte");
    }
  }, [status, router]);

  // Fetch orders placed by this customer
  const { data: ordersData, isLoading: ordersLoading } = trpcReact.order.myOrders.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  // Fetch customer profile
  const { data: profileData, refetch: refetchProfile } = trpcReact.customer.me.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  const updateProfileMutation = trpcReact.customer.updateProfile.useMutation({
    onSuccess: async (data) => {
      setProfileMessage("Vos informations ont été mises à jour.");
      refetchProfile();
      await updateSession({
        name: data.user.name,
        phone: data.user.phone,
        city: data.user.city,
        address: data.user.address,
      });
      setTimeout(() => setProfileMessage(null), 4000);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateCustomerProfile>({
    resolver: zodResolver(UpdateCustomerProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      address: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name || "",
        phone: profileData.phone || "",
        city: profileData.city || "",
        address: profileData.address || "",
      });
    }
  }, [profileData, reset]);

  const onProfileSubmit = (data: UpdateCustomerProfile) => {
    updateProfileMutation.mutate(data);
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: "En Attente", color: "bg-amber-50 text-amber-700 border-amber-200" },
    CONFIRMED: { label: "Confirmée", color: "bg-blue-50 text-blue-700 border-blue-200" },
    SHIPPED: { label: "En cours de livraison", color: "bg-purple-50 text-purple-700 border-purple-200" },
    DELIVERED: { label: "Livrée", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CANCELLED: { label: "Annulée", color: "bg-rose-50 text-rose-700 border-rose-200" },
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="grow flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 grow">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
            Espace Membre
          </span>
          <h1 className="mt-1 font-heading text-3xl font-light text-stone-900 sm:text-4xl">
            Bonjour, {session?.user?.name || "Client"}
          </h1>
          <p className="mt-1 text-xs text-stone-500">{session?.user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/produits"
            className="inline-flex h-10 items-center justify-center rounded-full bg-stone-100 px-5 text-xs font-semibold text-stone-700 hover:bg-stone-200 transition-colors"
          >
            Boutique
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-3 border-b border-stone-200/80 pb-4">
        <button
          onClick={() => setActiveTab("orders")}
          className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-gold text-stone-950 shadow-xs"
              : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
          }`}
        >
          Mes Commandes ({ordersData?.totalCount || 0})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-gold text-stone-950 shadow-xs"
              : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
          }`}
        >
          Mes Coordonnées
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-8">
        {activeTab === "orders" ? (
          <div>
            {ordersLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            ) : ordersData?.orders && ordersData.orders.length > 0 ? (
              <div className="flex flex-col gap-6">
                {ordersData.orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs"
                  >
                    {/* Order top bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gold-dark tracking-wide">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              statusLabels[order.status]?.color || "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {statusLabels[order.status]?.label || order.status}
                          </span>
                        </div>
                        <span className="text-xs text-stone-400 mt-1 block">
                          Commandé le{" "}
                          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/suivi/${order.orderNumber}`}
                          className="inline-flex h-9 items-center justify-center rounded-full bg-gold px-4 text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-xs hover:bg-gold-light transition-all"
                        >
                          Suivre le colis &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="mt-4 flex flex-col gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                            <Image
                              src={item.variant.product.images[0] || "/placeholder.jpg"}
                              alt={item.variant.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="grow min-w-0">
                            <h4 className="text-xs font-semibold text-stone-900 truncate">
                              {item.variant.product.name}
                            </h4>
                            <p className="text-[10px] text-stone-500">
                              {item.variant.product.brand} &bull; {item.variant.size}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-stone-500">Qté: {item.quantity}</span>
                            <span className="block text-xs font-bold text-gold-dark">
                              {(Number(item.price) * item.quantity).toLocaleString("fr-FR")} DH
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order summary footer */}
                    <div className="mt-4 flex justify-between items-center border-t border-stone-100 pt-4 text-xs">
                      <span className="text-stone-500">
                        Livraison à: <strong className="text-stone-700">{order.city}</strong> ({order.address})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500">Total payé à la livraison:</span>
                        <span className="text-sm font-bold text-gold-dark">
                          {Number(order.total).toLocaleString("fr-FR")} DH
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-200 bg-white/70 py-16 text-center shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mx-auto h-12 w-12 text-stone-400 mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <h3 className="text-base font-semibold text-stone-800">
                  Vous n'avez pas encore passé de commande
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  Découvrez notre catalogue pour trouver vos fragrances favorites.
                </p>
                <Link
                  href="/produits"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-sm hover:bg-gold-light"
                >
                  Découvrir la collection
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-xl">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-3">
                Mes Coordonnées de Livraison
              </h2>

              {profileMessage && (
                <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleSubmit(onProfileSubmit)} className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: 0612345678"
                      {...register("phone")}
                      className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Ville
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Casablanca"
                      {...register("city")}
                      className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Adresse par défaut
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Quartier, Rue, N° d'appartement..."
                    {...register("address")}
                    className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-11 items-center justify-center rounded-full bg-gold text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-md hover:bg-gold-light cursor-pointer"
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
