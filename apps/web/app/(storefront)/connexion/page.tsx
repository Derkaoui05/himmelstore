"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputSchema, type LoginInput } from "@himmel/types";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/compte";
  const { data: session } = useSession();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.push(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setError(res.error || "Email ou mot de passe incorrect.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:py-24">
      <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-xs">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
            Espace Client
          </span>
          <h1 className="mt-2 font-heading text-2xl font-light text-stone-900 sm:text-3xl">
            Connexion à votre compte
          </h1>
          <p className="mt-2 text-xs text-stone-500">
            Connectez-vous pour passer votre commande et suivre vos livraisons
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Adresse Email *
            </label>
            <input
              type="email"
              placeholder="votre@email.com"
              {...register("email")}
              className="rounded-lg border border-stone-200 bg-[#FAF8F5] px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            {errors.email && (
              <span className="text-xs text-rose-600">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Mot de passe *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="rounded-lg border border-stone-200 bg-[#FAF8F5] px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            {errors.password && (
              <span className="text-xs text-rose-600">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 flex h-12 w-full items-center justify-center rounded-full bg-gold text-sm font-semibold uppercase tracking-wider text-stone-950 shadow-md transition-all hover:bg-gold-light cursor-pointer ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-600">
          Vous n'avez pas encore de compte ?{" "}
          <Link
            href={`/inscription${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="font-semibold text-gold-dark hover:text-gold transition-colors underline"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grow flex items-center justify-center bg-[#FAF8F5]">
      <Suspense fallback={<div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
