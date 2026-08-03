"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { trpcReact } from "@/lib/trpc-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutInputSchema, type CheckoutInput } from "@himmel/types";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // tRPC order creation mutation
  const createOrderMutation = trpcReact.order.create.useMutation({
    onSuccess: (data) => {
      setSuccessOrder(data);
      clearCart();
    },
    onError: (err) => {
      setServerError(err.message || "Une erreur est survenue lors de la création de la commande.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(CheckoutInputSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      city: "",
      address: "",
      notes: "",
      items: [],
    },
  });

  // Dynamically set items from Zustand in the form data during submission
  const onSubmit = async (data: Omit<CheckoutInput, "items">) => {
    setServerError(null);
    if (items.length === 0) {
      setServerError("Votre panier est vide.");
      return;
    }

    const orderItems = items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    createOrderMutation.mutate({
      ...data,
      items: orderItems,
    });
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <main className="grow flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  // Render Confirmation Screen upon success
  if (successOrder) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <main className="mx-auto w-full max-w-2xl px-6 py-20 text-center grow flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
            Commande Confirmée
          </span>
          <h1 className="mt-4 font-heading text-3xl font-light sm:text-4xl text-white">
            Merci pour votre confiance !
          </h1>
          
          <p className="mt-4 text-sm text-zinc-400 max-w-md">
            Votre commande a été enregistrée avec succès. Notre équipe vous contactera par téléphone pour valider la livraison.
          </p>

          {/* Details Box */}
          <div className="mt-8 w-full rounded-xl border border-white/5 bg-zinc-950/40 p-6 text-left">
            <div className="flex justify-between border-b border-white/5 pb-3 text-sm">
              <span className="text-zinc-500">N° de commande</span>
              <span className="font-bold text-gold tracking-wide">{successOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-3 text-sm">
              <span className="text-zinc-500">Client</span>
              <span className="text-white">{successOrder.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-3 text-sm">
              <span className="text-zinc-500">Téléphone</span>
              <span className="text-white">{successOrder.phone}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-3 text-sm">
              <span className="text-zinc-500">Ville</span>
              <span className="text-white">{successOrder.city}</span>
            </div>
            <div className="flex justify-between pt-3 text-sm">
              <span className="text-zinc-500 font-semibold">Total à payer (à la livraison)</span>
              <span className="font-bold text-gold">{Number(successOrder.total).toLocaleString("fr-FR")} DH</span>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <Link
              href="/produits"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-8 text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-gold-light hover:scale-105"
            >
              Retourner à la boutique
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 grow">
        <h1 className="font-heading text-3xl font-light text-white sm:text-4xl">
          Passer votre commande
        </h1>

        {items.length === 0 ? (
          <div className="mt-12 text-center py-20 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20">
            <p className="text-zinc-500">Votre panier est vide. Vous devez ajouter des produits avant de commander.</p>
            <Link
              href="/produits"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-wider text-black hover:bg-gold-light"
            >
              Voir la boutique
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left: Checkout Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 flex flex-col gap-6">
              <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col gap-5">
                <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-3">
                  Informations de Livraison
                </h2>

                {serverError && (
                  <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-400">
                    {serverError}
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="customerName" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Nom Complet *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    placeholder="Ex: Ahmed Benjelloun"
                    {...register("customerName")}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
                  />
                  {errors.customerName && (
                    <span className="text-xs text-rose-500 mt-1">{errors.customerName.message}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Ex: 0612345678"
                    {...register("phone")}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
                  />
                  {errors.phone && (
                    <span className="text-xs text-rose-500 mt-1">{errors.phone.message}</span>
                  )}
                  <span className="text-[10px] text-zinc-500">Format marocain valide requis (ex: 05/06/07 suivi de 8 chiffres).</span>
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Ville *
                  </label>
                  <input
                    type="text"
                    id="city"
                    placeholder="Ex: Casablanca"
                    {...register("city")}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
                  />
                  {errors.city && (
                    <span className="text-xs text-rose-500 mt-1">{errors.city.message}</span>
                  )}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Adresse de Livraison complète *
                  </label>
                  <textarea
                    id="address"
                    placeholder="Quartier, N° de rue, N° d'appartement..."
                    rows={3}
                    {...register("address")}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
                  />
                  {errors.address && (
                    <span className="text-xs text-rose-500 mt-1">{errors.address.message}</span>
                  )}
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Instructions Particulières / Notes (Optionnel)
                  </label>
                  <textarea
                    id="notes"
                    placeholder="Ex: Appelez-moi avant de livrer, ou livrer après 17h..."
                    rows={2}
                    {...register("notes")}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </form>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-6 flex flex-col">
                <h2 className="text-lg font-semibold text-white mb-6">
                  Votre Commande
                </h2>

                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-1 mb-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 items-center">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-zinc-900">
                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div className="grow min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{item.productName}</h4>
                        <p className="text-[10px] text-zinc-500">{item.brand} — {item.size}</p>
                      </div>
                      <span className="text-xs text-zinc-400">x{item.quantity}</span>
                      <span className="text-xs font-bold text-gold">{(item.price * item.quantity).toLocaleString("fr-FR")} DH</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 flex flex-col gap-3 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{getTotal().toLocaleString("fr-FR")} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-emerald-500 font-semibold">Gratuite</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode de paiement</span>
                    <span className="text-white">Paiement Cash à la livraison (COD)</span>
                  </div>
                  
                  <div className="border-t border-white/5 mt-2 pt-4 flex justify-between text-base font-bold text-white">
                    <span>Total</span>
                    <span className="text-gold">{getTotal().toLocaleString("fr-FR")} DH</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className={`mt-8 flex h-12 w-full items-center justify-center rounded-full bg-gold text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-gold-light ${
                    isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  {isSubmitting ? "Traitement..." : "Confirmer la commande"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
