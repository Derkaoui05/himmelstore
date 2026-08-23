"use client";

import { use } from "react";
import { trpcReact } from "@/lib/trpc-client";
import Image from "next/image";
import Link from "next/link";

interface TrackingPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default function TrackingPage({ params }: TrackingPageProps) {
  const resolvedParams = use(params);
  const orderNumber = decodeURIComponent(resolvedParams.orderNumber);

  const { data, isLoading, error } = trpcReact.order.track.useQuery(
    { orderNumber },
    { refetchInterval: 15000 } // Auto-poll every 15s for live updates
  );

  if (isLoading) {
    return (
      <main className="grow flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </main>
    );
  }

  if (error || !data?.order) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-20 text-center grow flex flex-col items-center justify-center">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-xs w-full">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-stone-900">Commande introuvable</h1>
          <p className="mt-2 text-xs text-stone-500">
            Aucune commande ne correspond au numéro <strong className="text-stone-800">{orderNumber}</strong>.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/compte"
              className="inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-sm hover:bg-gold-light"
            >
              Voir mon compte
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { order, steps, isCancelled } = data;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8 grow">
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
            Suivi de Commande en Direct
          </span>
          <h1 className="mt-1 font-heading text-3xl font-light text-stone-900 sm:text-4xl">
            N° {order.orderNumber}
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Commandé le {new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <Link
          href="/compte"
          className="inline-flex h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
        >
          &larr; Retour à mes commandes
        </Link>
      </div>

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-6 flex items-center gap-4 text-rose-800">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Cette commande a été annulée</h3>
            <p className="text-xs text-rose-600 mt-0.5">
              Si vous avez des questions ou souhaitez repasser commande, contactez notre service client.
            </p>
          </div>
        </div>
      )}

      {/* Visual Stepper */}
      {!isCancelled && (
        <div className="mt-8 rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-4">
            Progression de votre livraison
          </h2>

          <div className="mt-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex flex-col items-start md:items-center text-left md:text-center relative">
                  {/* Circle Indicator */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      step.current
                        ? "border-gold bg-gold text-stone-950 shadow-md ring-4 ring-gold/20 scale-105"
                        : step.completed
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-stone-200 bg-stone-50 text-stone-400"
                    }`}
                  >
                    {step.completed && !step.current ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Text Details */}
                  <h4
                    className={`mt-3 text-xs font-semibold uppercase tracking-wider ${
                      step.current ? "text-gold-dark font-bold" : step.completed ? "text-stone-900" : "text-stone-400"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-stone-500 max-w-45 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order Details & Summary Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Items */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
            Articles de la commande
          </h3>

          <div className="mt-4 flex flex-col divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center gap-4 first:pt-0 last:pb-0">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream">
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
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {item.variant.product.brand} &bull; {item.variant.size}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500">x{item.quantity}</span>
                  <span className="block text-xs font-bold text-gold-dark">
                    {(Number(item.price) * item.quantity).toLocaleString("fr-FR")} DH
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recipient & Total */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
              Informations de Livraison
            </h3>
            
            <div className="mt-4 flex flex-col gap-2 text-xs text-stone-600 leading-relaxed">
              <p className="font-semibold text-stone-900 text-sm">{order.customerName}</p>
              <p>Téléphone: <span className="text-stone-900 font-medium">{order.phone}</span></p>
              <p>Ville: <span className="text-stone-900 font-medium">{order.city}</span></p>
              <p>Adresse: <span className="text-stone-800">{order.address}</span></p>
              {order.notes && (
                <p className="mt-2 rounded-lg bg-stone-50 border border-stone-200 p-2.5 text-stone-600 italic">
                  Note: {order.notes}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 mt-6 flex justify-between items-center text-xs">
            <div>
              <span className="text-stone-500 block">Paiement Cash (COD)</span>
              <span className="text-stone-700 font-semibold">Total à payer :</span>
            </div>
            <span className="text-lg font-bold text-gold-dark">
              {Number(order.total).toLocaleString("fr-FR")} DH
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
