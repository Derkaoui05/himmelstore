"use client";

import { use } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { trpcReact } from "@/lib/trpc-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditProductPage({ params }: PageProps) {
  const { id } = use(params);

  // Fetch product data
  const { data: product, isLoading } = trpcReact.product.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-zinc-500">Produit introuvable.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white font-heading">Modifier le parfum</h1>
        <p className="text-xs text-zinc-500 mt-1">Mettez à jour les informations générales et les variantes du parfum</p>
      </div>

      <ProductForm initialData={product} productId={id} />
    </div>
  );
}
