import ProductDetailsClient from "@/components/storefront/ProductDetailsClient";
import { serverTrpc } from "@/lib/trpc-server";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const trpc = await serverTrpc();
    const product = await trpc.product.getBySlug({ slug });
    
    return {
      title: `${product.name} - ${product.brand}`,
      description: product.description.substring(0, 160),
    };
  } catch (error) {
    return {
      title: "Produit non trouvé",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product: any = null;

  try {
    const trpc = await serverTrpc();
    product = await trpc.product.getBySlug({ slug });
  } catch (error) {
    // Return 404 if product fetch failed or not found
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 grow">
      <ProductDetailsClient product={product} />
    </main>
  );
}
