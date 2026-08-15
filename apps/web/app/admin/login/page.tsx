"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setError("Identifiants incorrects ou accès refusé.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-6">
      {/* Decorative background light */}
      <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-stone-200/80 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="font-heading text-3xl font-bold tracking-widest text-gold-dark mb-2 hover:text-gold transition-colors">
            HIMMEL
          </Link>
          <h2 className="text-xl font-semibold text-stone-900">Espace Administration</h2>
          <p className="text-xs text-stone-500">Connectez-vous pour gérer votre boutique en ligne</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Adresse Email
            </label>
            <input
              type="email"
              placeholder="admin@himmel.ma"
              {...register("email", { required: true })}
              className="rounded-lg border border-stone-200 bg-[#FAF8F5] px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: true })}
              className="rounded-lg border border-stone-200 bg-[#FAF8F5] px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 flex h-12 w-full items-center justify-center rounded-full bg-gold text-sm font-semibold uppercase tracking-wider text-stone-950 shadow-md transition-all hover:bg-gold-light cursor-pointer ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
