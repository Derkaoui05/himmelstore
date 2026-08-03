import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-gold selection:text-black">
      <Navbar />
      <main className="grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
