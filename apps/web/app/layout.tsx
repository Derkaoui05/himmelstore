import type { Metadata } from "next";
import { Figtree, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/lib/providers";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Himmel Store — Parfumerie en ligne au Maroc",
    template: "%s | Himmel Store",
  },
  description:
    "Découvrez notre collection de parfums de luxe. Livraison partout au Maroc. Bleu de Chanel, Dior Sauvage, YSL Libre et plus encore.",
  keywords: [
    "parfum",
    "parfumerie",
    "maroc",
    "luxe",
    "chanel",
    "dior",
    "ysl",
    "tom ford",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn("h-full antialiased", figtree.variable, playfair.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
