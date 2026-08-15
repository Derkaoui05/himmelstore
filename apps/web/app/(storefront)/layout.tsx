import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-stone-900 selection:bg-gold/30 selection:text-stone-950">
      <Navbar />
      <main className="grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
