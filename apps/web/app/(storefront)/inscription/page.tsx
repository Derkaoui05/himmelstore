"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterCustomerInputSchema, type RegisterCustomerInput } from "@himmel/types";
import { trpcReact } from "@/lib/trpc-client";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/compte";
  const { data: session } = useSession();

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.push(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  const registerMutation = trpcReact.customer.register.useMutation({
    onError: (err) => {
      setServerError(err.message || "Une erreur est survenue lors de la création de votre compte.");
      setLoading(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCustomerInput>({
    resolver: zodResolver(RegisterCustomerInputSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      city: "",
      address: "",
    },
  });

  const onSubmit = async (data: RegisterCustomerInput) => {
    setServerError(null);
    setLoading(true);

    try {
      // 1. Create account via tRPC
      await registerMutation.mutateAsync(data);

      // 2. Automatically log the customer in
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        // In case auto-login fails, redirect to login page
        router.push(`/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setServerError(err.message || "Une erreur est survenue.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16 sm:py-20">
      <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-xs">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
            Bienvenue chez Himmel
          </span>
          <h1 className="mt-2 font-heading text-2xl font-light text-stone-900 sm:text-3xl">
            Créer votre compte
          </h1>
          <p className="mt-2 text-xs text-stone-500">
            Rejoignez-nous pour commander et suivre vos parfums en direct
          </p>
        </div>

        {serverError && (
          <div className="mt-6 rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Nom complet *
            </label>
            <input
              type="text"
              placeholder="Ex: Fatima Zahrae"
              {...register("name")}
              className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            {errors.name && (
              <span className="text-xs text-rose-600">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Adresse Email *
            </label>
            <input
              type="email"
              placeholder="votre@email.com"
              {...register("email")}
              className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            {errors.email && (
              <span className="text-xs text-rose-600">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Mot de passe (min. 6 caractères) *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            {errors.password && (
              <span className="text-xs text-rose-600">{errors.password.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Téléphone
              </label>
              <input
                type="tel"
                placeholder="Ex: 0612345678"
                {...register("phone")}
                className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {errors.phone && (
                <span className="text-xs text-rose-600">{errors.phone.message}</span>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Ville
              </label>
              <input
                type="text"
                placeholder="Ex: Casablanca"
                {...register("city")}
                className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {errors.city && (
                <span className="text-xs text-rose-600">{errors.city.message}</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Adresse de Livraison (Optionnel)
            </label>
            <textarea
              rows={2}
              placeholder="Quartier, Rue, N°..."
              {...register("address")}
              className="rounded-lg border border-stone-200 bg-cream px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            {errors.address && (
              <span className="text-xs text-rose-600">{errors.address.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 flex h-12 w-full items-center justify-center rounded-full bg-gold text-sm font-semibold uppercase tracking-wider text-stone-950 shadow-md transition-all hover:bg-gold-light cursor-pointer ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <div className="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-600">
          Vous avez déjà un compte ?{" "}
          <Link
            href={`/connexion${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="font-semibold text-gold-dark hover:text-gold transition-colors underline"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="grow flex items-center justify-center bg-cream">
      <Suspense fallback={<div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
