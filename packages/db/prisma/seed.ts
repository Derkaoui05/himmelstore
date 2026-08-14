import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { scryptSync, randomBytes } from "crypto";

import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Starting seed database...");

  // 1. Clean existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.admin.deleteMany({});

  // 2. Create Admin
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = hashPassword(adminPassword);
  
  const admin = await prisma.admin.create({
    data: {
      email: "admin@himmel.ma",
      password: hashedPassword,
      name: "Himmel Admin",
    },
  });
  console.log(`Created admin: ${admin.email} with password: ${adminPassword}`);

  // 3. Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Boisé & Épicé", slug: "boise-epice" },
    }),
    prisma.category.create({
      data: { name: "Frais & Hespéridé", slug: "frais-hesperide" },
    }),
    prisma.category.create({
      data: { name: "Floral & Sucré", slug: "floral-sucre" },
    }),
    prisma.category.create({
      data: { name: "Oriental & Ambré", slug: "oriental-ambre" },
    }),
  ]);
  console.log(`Created ${categories.length} categories.`);

  const [boise, frais, floral, oriental] = categories;
  if (!boise || !frais || !floral || !oriental) {
    throw new Error("Categories could not be created correctly");
  }

  // 4. Create Products & Variants
  const productsData = [
    {
      name: "Bleu de Chanel",
      slug: "bleu-de-chanel",
      description: "Un parfum boisé aromatique aux notes captivantes. Un hommage à la liberté masculine qui s'exprime dans un sillage captivant et intemporel.",
      brand: "Chanel",
      gender: "HOMME" as const,
      concentration: "Eau de Parfum",
      featured: true,
      categoryId: boise.id,
      images: [
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
      ],
      variants: {
        create: [
          { size: "50ml", price: "950.00", stock: 15, sku: "BLEU-EDP-50" },
          { size: "100ml", price: "1350.00", stock: 25, sku: "BLEU-EDP-100" },
        ],
      },
    },
    {
      name: "Sauvage",
      slug: "dior-sauvage",
      description: "Une création inspirée des grands espaces. Un ciel bleu ozone qui domine un désert rocheux chauffé à blanc. Une fraîcheur puissante et noble.",
      brand: "Dior",
      gender: "HOMME" as const,
      concentration: "Eau de Toilette",
      featured: true,
      categoryId: frais.id,
      images: [
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
      ],
      variants: {
        create: [
          { size: "60ml", price: "880.00", stock: 20, sku: "SAUV-EDT-60" },
          { size: "100ml", price: "1200.00", stock: 30, sku: "SAUV-EDT-100" },
        ],
      },
    },
    {
      name: "Libre",
      slug: "ysl-libre",
      description: "Le parfum d'une femme forte, audacieuse et libre d'expérimenter sa liberté sans limite. La tension entre la sensualité de la fleur d'oranger du Maroc et la force de la lavande de France.",
      brand: "Yves Saint Laurent",
      gender: "FEMME" as const,
      concentration: "Eau de Parfum",
      featured: true,
      categoryId: floral.id,
      images: [
        "https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&w=600&q=80",
      ],
      variants: {
        create: [
          { size: "30ml", price: "720.00", stock: 12, sku: "YSL-LIB-30" },
          { size: "50ml", price: "1050.00", stock: 18, sku: "YSL-LIB-50" },
          { size: "90ml", price: "1450.00", stock: 10, sku: "YSL-LIB-90" },
        ],
      },
    },
    {
      name: "La Vie Est Belle",
      slug: "lancome-la-vie-est-belle",
      description: "Un sillage de bonheur, de sourire et de liberté. Le premier Iris Gourmand créé pour Lancôme par trois des plus grands parfumeurs français.",
      brand: "Lancôme",
      gender: "FEMME" as const,
      concentration: "Eau de Parfum",
      featured: false,
      categoryId: floral.id,
      images: [
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
      ],
      variants: {
        create: [
          { size: "50ml", price: "890.00", stock: 8, sku: "LAN-LVEB-50" },
          { size: "100ml", price: "1250.00", stock: 15, sku: "LAN-LVEB-100" },
        ],
      },
    },
    {
      name: "Oud Wood",
      slug: "tom-ford-oud-wood",
      description: "L'un des ingrédients les plus rares, précieux et chers de l'arsenal d'un parfumeur, le bois de oud est souvent brûlé dans les temples du Bhoutan. Le bois de santal exotique et le vétiver y apportent une tonalité sensuelle.",
      brand: "Tom Ford",
      gender: "UNISEXE" as const,
      concentration: "Eau de Parfum",
      featured: true,
      categoryId: oriental.id,
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
      ],
      variants: {
        create: [
          { size: "50ml", price: "2400.00", stock: 5, sku: "TF-OW-50" },
          { size: "100ml", price: "3500.00", stock: 7, sku: "TF-OW-100" },
        ],
      },
    },
  ];

  for (const product of productsData) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${createdProduct.name} (${createdProduct.brand})`);
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
