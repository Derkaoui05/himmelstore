import { z } from "zod";

export const GenderSchema = z.enum(["HOMME", "FEMME", "UNISEXE"]);
export type Gender = z.infer<typeof GenderSchema>;

export const OrderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// Product filters for storefront catalog
export const ProductFiltersSchema = z.object({
  gender: GenderSchema.optional(),
  brand: z.string().optional(),
  categorySlug: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(12),
});
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;

// Variant schema for product creation/update
export const VariantInputSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, "La taille est requise (ex: 100ml)"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Le prix doit être un nombre supérieur à 0",
  }),
  stock: z.number().int().nonnegative("Le stock ne peut pas être négatif"),
  sku: z.string().min(1, "Le SKU est requis"),
});
export type VariantInput = z.infer<typeof VariantInputSchema>;

// Product schema for creation/update
export const ProductInputSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  brand: z.string().min(2, "La marque doit contenir au moins 2 caractères"),
  gender: GenderSchema,
  concentration: z.string().nullable().optional(),
  images: z.array(z.string()).min(1, "Au moins une image est requise"),
  featured: z.boolean(),
  active: z.boolean(),
  categoryId: z.string().min(1, "La catégorie est requise"),
  variants: z.array(VariantInputSchema).min(1, "Au moins une variante est requise"),
});
export type ProductInput = z.infer<typeof ProductInputSchema>;

// Order Item input
export const OrderItemInputSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().positive("La quantité doit être supérieure à 0"),
});
export type OrderItemInput = z.infer<typeof OrderItemInputSchema>;

// Checkout / Order creation schema (Moroccan details)
export const CheckoutInputSchema = z.object({
  customerName: z.string().min(3, "Le nom complet doit contenir au moins 3 caractères"),
  phone: z.string().regex(/^(?:\+212|0)[5-7]\d{8}$/, "Numéro de téléphone marocain invalide (ex: 0612345678)"),
  city: z.string().min(2, "La ville est requise"),
  address: z.string().min(5, "L'adresse de livraison complète est requise (min 5 caractères)"),
  notes: z.string().optional(),
  items: z.array(OrderItemInputSchema).min(1, "Votre panier est vide"),
});
export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;

// Status transition schema
export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: OrderStatusSchema,
});
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;

// Customer Registration Schema
export const RegisterCustomerInputSchema = z.object({
  name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  phone: z.string().regex(/^(?:\+212|0)[5-7]\d{8}$/, "Numéro de téléphone marocain invalide (ex: 0612345678)").optional().or(z.literal("")),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères").optional().or(z.literal("")),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères").optional().or(z.literal("")),
});
export type RegisterCustomerInput = z.infer<typeof RegisterCustomerInputSchema>;

// Customer Login Schema
export const LoginInputSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

// Customer Profile Update Schema
export const UpdateCustomerProfileSchema = z.object({
  name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  phone: z.string().regex(/^(?:\+212|0)[5-7]\d{8}$/, "Numéro de téléphone marocain invalide").optional().or(z.literal("")),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères").optional().or(z.literal("")),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères").optional().or(z.literal("")),
});
export type UpdateCustomerProfile = z.infer<typeof UpdateCustomerProfileSchema>;

