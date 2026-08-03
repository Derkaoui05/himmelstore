import ProductForm from "@/components/admin/ProductForm";

export default function AdminNewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Ajouter un nouveau parfum</h1>
        <p className="text-xs text-zinc-500 mt-1">Entrez les informations du parfum et définissez ses variantes de taille et prix</p>
      </div>

      <ProductForm />
    </div>
  );
}
