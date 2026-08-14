"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductInputSchema, type ProductInput } from "@himmel/types";
import { trpcReact } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ProductFormProps {
  initialData?: any; // If editing
  productId?: string;
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Fetch categories for the category dropdown
  const { data: categories } = trpcReact.category.list.useQuery();

  const isEdit = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductInputSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description,
          brand: initialData.brand,
          gender: initialData.gender,
          concentration: initialData.concentration || "",
          images: initialData.images || [],
          featured: initialData.featured,
          active: initialData.active,
          categoryId: initialData.categoryId,
          variants: initialData.variants.map((v: any) => ({
            id: v.id,
            size: v.size,
            price: String(v.price),
            stock: v.stock,
            sku: v.sku,
          })),
        }
      : {
          name: "",
          slug: "",
          description: "",
          brand: "",
          gender: "HOMME",
          concentration: "Eau de Parfum",
          images: [],
          featured: false,
          active: true,
          categoryId: "",
          variants: [{ size: "100ml", price: "", stock: 10, sku: "" }],
        },
  });

  // Re-populate form when initialData arrives asynchronously
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description,
        brand: initialData.brand,
        gender: initialData.gender,
        concentration: initialData.concentration || "",
        images: initialData.images || [],
        featured: initialData.featured,
        active: initialData.active,
        categoryId: initialData.categoryId,
        variants: initialData.variants.map((v: any) => ({
          id: v.id,
          size: v.size,
          price: String(v.price),
          stock: v.stock,
          sku: v.sku,
        })),
      });
    }
  }, [initialData, reset]);

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  });

  const imagesList = watch("images") || [];
  const nameValue = watch("name");

  // Auto-generate slug from name when creating a new product
  useEffect(() => {
    if (!isEdit && nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, isEdit, setValue]);

  // tRPC mutations
  const createMutation = trpcReact.product.create.useMutation({
    onSuccess: () => {
      router.push("/admin/produits");
      router.refresh();
    },
    onError: (err) => {
      setError(err.message || "Erreur de création du produit.");
    },
  });

  const updateMutation = trpcReact.product.update.useMutation({
    onSuccess: () => {
      router.push("/admin/produits");
      router.refresh();
    },
    onError: (err) => {
      setError(err.message || "Erreur de modification du produit.");
    },
  });

  const onSubmit = (data: ProductInput) => {
    setError(null);
    if (isEdit && productId) {
      updateMutation.mutate({ ...data, id: productId });
    } else {
      createMutation.mutate(data);
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setValue("images", [...imagesList, newImageUrl.trim()], { shouldValidate: true });
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    setValue(
      "images",
      imagesList.filter((_, idx) => idx !== index),
      { shouldValidate: true }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-4xl bg-zinc-950/40 rounded-xl border border-white/5 p-8">
      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Core Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Nom du Parfum *</label>
          <input
            type="text"
            placeholder="Ex: Bleu de Chanel"
            {...register("name")}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
          />
          {errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Slug (URL) *</label>
          <input
            type="text"
            placeholder="Ex: bleu-de-chanel"
            {...register("slug")}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
          />
          {errors.slug && <span className="text-xs text-rose-500">{errors.slug.message}</span>}
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-medium">Marque *</label>
          <input
            type="text"
            placeholder="Ex: Chanel"
            {...register("brand")}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
          />
          {errors.brand && <span className="text-xs text-rose-500">{errors.brand.message}</span>}
        </div>

        {/* Concentration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Concentration</label>
          <input
            type="text"
            placeholder="Ex: Eau de Parfum, Eau de Toilette..."
            {...register("concentration")}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Catégorie *</label>
          <select
            {...register("categoryId")}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="text-xs text-rose-500">{errors.categoryId.message}</span>}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Genre *</label>
          <select
            {...register("gender")}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
          >
            <option value="HOMME">Homme</option>
            <option value="FEMME">Femme</option>
            <option value="UNISEXE">Unisexe</option>
          </select>
          {errors.gender && <span className="text-xs text-rose-500">{errors.gender.message}</span>}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-medium">Description *</label>
        <textarea
          placeholder="Décrivez les notes de tête, de cœur, de fond, et l'histoire olfactive..."
          rows={4}
          {...register("description")}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
        />
        {errors.description && <span className="text-xs text-rose-500">{errors.description.message}</span>}
      </div>

      {/* Flags: Featured & Active */}
      <div className="flex gap-8 border-y border-white/5 py-4">
        <label className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
          <input
            type="checkbox"
            {...register("active")}
            className="h-4 w-4 rounded border-zinc-850 text-gold bg-zinc-900 accent-gold"
          />
          Disponible dans la boutique (Actif)
        </label>

        <label className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
          <input
            type="checkbox"
            {...register("featured")}
            className="h-4 w-4 rounded border-zinc-850 text-gold bg-zinc-900 accent-gold"
          />
          Mettre en avant sur la page d'accueil (Featured)
        </label>
      </div>

      {/* Image Gallery URLs */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Images du produit *</h3>
        
        {errors.images && <span className="text-xs text-rose-500">{errors.images.message}</span>}
        
        {/* Images list display */}
        <div className="flex flex-wrap gap-4">
          {imagesList.map((imgUrl, idx) => (
            <div key={idx} className="group relative h-24 w-24 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
              <img src={imgUrl} alt={`Product thumbnail ${idx + 1}`} className="object-cover h-full w-full" />
              <button
                type="button"
                onClick={() => removeImageUrl(idx)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-rose-500 font-bold transition-all"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>

        {/* Add image row */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Entrez l'URL d'une image (ex: Unsplash, Cloudinary...)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-grow rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-gold text-xs px-5 text-zinc-300 hover:text-white transition-colors"
          >
            Ajouter l'image
          </button>
        </div>
      </div>

      {/* Variants details */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Variantes du parfum *</h3>
          <button
            type="button"
            onClick={() => appendVariant({ size: "", price: "", stock: 10, sku: "" })}
            className="text-xs font-semibold text-gold hover:text-gold-light"
          >
            + Ajouter une variante
          </button>
        </div>

        {errors.variants && <span className="text-xs text-rose-500">{errors.variants.message}</span>}

        <div className="flex flex-col gap-4">
          {variantFields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 rounded-lg bg-zinc-900/40 border border-zinc-900 items-end">
              {/* Size */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Taille *</label>
                <input
                  type="text"
                  placeholder="Ex: 100ml"
                  {...register(`variants.${idx}.size` as const)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-gold focus:outline-none"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Prix (DH) *</label>
                <input
                  type="text"
                  placeholder="Ex: 1200"
                  {...register(`variants.${idx}.price` as const)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-gold focus:outline-none"
                />
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Stock *</label>
                <input
                  type="number"
                  placeholder="Ex: 20"
                  {...register(`variants.${idx}.stock` as const, { valueAsNumber: true })}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-gold focus:outline-none"
                />
              </div>

              {/* SKU */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">SKU unique *</label>
                <input
                  type="text"
                  placeholder="Ex: SAUV-EDT-100"
                  {...register(`variants.${idx}.sku` as const)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-gold focus:outline-none"
                />
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => variantFields.length > 1 && removeVariant(idx)}
                disabled={variantFields.length <= 1}
                className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500/20 text-[10px] py-2 text-zinc-500 hover:text-rose-400 disabled:opacity-40 transition-colors"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-4 border-t border-white/5 pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex h-12 items-center justify-center rounded-full bg-gold px-8 text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-gold-light ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          {isSubmitting ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer le produit"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produits")}
          className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 px-8 text-sm font-semibold uppercase tracking-wider text-zinc-400 hover:border-zinc-700 hover:text-white transition-all"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
