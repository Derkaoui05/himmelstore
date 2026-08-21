import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import { ProductFiltersSchema, ProductInputSchema } from "@himmel/types";

export const productRouter = router({
  /**
   * List all products with pagination and filters.
   * Can be used by both storefront and admin (with includeInactive flag).
   */
  list: publicProcedure
    .input(ProductFiltersSchema.extend({
      includeInactive: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const { gender, brand, categorySlug, priceMin, priceMax, search, page, limit, includeInactive } = input;
      
      const where: any = {};
      
      // Filter by active status
      if (!includeInactive) {
        where.active = true;
      }

      if (gender) {
        where.gender = gender;
      }

      if (brand) {
        where.brand = brand;
      }

      if (categorySlug) {
        where.category = {
          slug: categorySlug,
        };
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      // Filter by price range looking at variants
      if (priceMin !== undefined || priceMax !== undefined) {
        where.variants = {
          some: {
            price: {
              ...(priceMin !== undefined ? { gte: priceMin } : {}),
              ...(priceMax !== undefined ? { lte: priceMax } : {}),
            },
          },
        };
      }

      const [products, totalCount] = await Promise.all([
        ctx.db.product.findMany({
          where,
          include: {
            category: true,
            variants: {
              orderBy: {
                price: "asc",
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.db.product.count({ where }),
      ]);

      return {
        products: products.map((p) => ({
          ...p,
          variants: p.variants.map((v) => ({
            ...v,
            price: Number(v.price),
          })),
        })),
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    }),

  /**
   * Fetch featured products for the homepage.
   */
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().default(6) }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          featured: true,
          active: true,
        },
        include: {
          category: true,
          variants: {
            orderBy: {
              price: "asc",
            },
          },
        },
        take: input.limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      return products.map((p) => ({
        ...p,
        variants: p.variants.map((v) => ({
          ...v,
          price: Number(v.price),
        })),
      }));
    }),

  /**
   * Get a single product by its slug.
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { slug: input.slug },
        include: {
          category: true,
          variants: {
            orderBy: {
              price: "asc",
            },
          },
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce produit n'existe pas.",
        });
      }

      return {
        ...product,
        variants: product.variants.map((v) => ({
          ...v,
          price: Number(v.price),
        })),
      };
    }),

  /**
   * Get a single product by its ID (Admin only).
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          variants: {
            orderBy: {
              price: "asc",
            },
          },
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produit non trouvé.",
        });
      }

      return {
        ...product,
        variants: product.variants.map((v) => ({
          ...v,
          price: Number(v.price),
        })),
      };
    }),


  /**
   * Create a new product (Admin only).
   */
  create: protectedProcedure
    .input(ProductInputSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if slug is unique
      const existingProduct = await ctx.db.product.findUnique({
        where: { slug: input.slug },
      });

      if (existingProduct) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un produit avec ce slug (URL) existe déjà.",
        });
      }

      return ctx.db.product.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          brand: input.brand,
          gender: input.gender,
          concentration: input.concentration,
          images: input.images,
          topNotes: input.topNotes || [],
          heartNotes: input.heartNotes || [],
          baseNotes: input.baseNotes || [],
          featured: input.featured,
          active: input.active,
          categoryId: input.categoryId,
          variants: {
            create: input.variants.map((v) => ({
              size: v.size,
              price: v.price,
              stock: v.stock,
              sku: v.sku,
            })),
          },
        } as any,
        include: {
          variants: true,
        },
      });
    }),

  /**
   * Update an existing product (Admin only).
   */
  update: protectedProcedure
    .input(
      ProductInputSchema.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, variants, ...productData } = input;

      // Verify product exists
      const existingProduct = await ctx.db.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produit non trouvé.",
        });
      }

      // Check slug uniqueness if it changed
      if (productData.slug !== existingProduct.slug) {
        const slugConflict = await ctx.db.product.findUnique({
          where: { slug: productData.slug },
        });
        if (slugConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Un autre produit avec ce slug (URL) existe déjà.",
          });
        }
      }

      return ctx.db.$transaction(async (tx) => {
        // Update product core fields
        const updatedProduct = await tx.product.update({
          where: { id },
          data: {
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            brand: productData.brand,
            gender: productData.gender,
            concentration: productData.concentration,
            images: productData.images,
            topNotes: productData.topNotes || [],
            heartNotes: productData.heartNotes || [],
            baseNotes: productData.baseNotes || [],
            featured: productData.featured,
            active: productData.active,
            categoryId: productData.categoryId,
          } as any,
        });

        // Manage variants
        const dbVariants = await tx.variant.findMany({
          where: { productId: id },
        });

        const inputVariantIds = variants
          .map((v) => v.id)
          .filter((vid): vid is string => typeof vid === "string" && vid.length > 0);

        // Delete variants that are in DB but not in input list
        const toDelete = dbVariants.filter((dv) => !inputVariantIds.includes(dv.id));
        for (const variant of toDelete) {
          try {
            await tx.variant.delete({
              where: { id: variant.id },
            });
          } catch (err) {
            // Soft-delete: if variant is referenced in orderItems, set stock to 0 instead of deleting
            await tx.variant.update({
              where: { id: variant.id },
              data: { stock: 0 },
            });
          }
        }

        // Upsert variants
        for (const v of variants) {
          if (v.id) {
            await tx.variant.update({
              where: { id: v.id },
              data: {
                size: v.size,
                price: v.price,
                stock: v.stock,
                sku: v.sku,
              },
            });
          } else {
            await tx.variant.create({
              data: {
                productId: id,
                size: v.size,
                price: v.price,
                stock: v.stock,
                sku: v.sku,
              },
            });
          }
        }

        return tx.product.findUnique({
          where: { id },
          include: {
            variants: {
              orderBy: { price: "asc" },
            },
          },
        });
      });
    }),

  /**
   * Delete a product (Admin only).
   * Attempts a hard delete, falls back to making active = false if referenced in orders.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.product.delete({
          where: { id: input.id },
        });
        return { success: true, deleted: true, message: "Produit supprimé définitivement." };
      } catch (err) {
        // If referencing in order items, soft delete
        await ctx.db.product.update({
          where: { id: input.id },
          data: { active: false },
        });
        return {
          success: true,
          deleted: false,
          softDeleted: true,
          message: "Le produit est lié à des commandes passées. Il a été désactivé pour la boutique storefront.",
        };
      }
    }),
});
