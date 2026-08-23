import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-cream py-16 text-stone-600">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <BrandLogo subtitleClassName="text-stone-500" />
            <p className="text-sm leading-relaxed text-stone-600">
              Votre destination ultime pour les parfums de luxe et de niche au Maroc. L'excellence olfactive livrée chez vous.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Boutique
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <Link href="/produits" className="hover:text-gold-dark transition-colors">
                  Tous les parfums
                </Link>
              </li>
              <li>
                <Link href="/produits?gender=HOMME" className="hover:text-gold-dark transition-colors">
                  Pour Homme
                </Link>
              </li>
              <li>
                <Link href="/produits?gender=FEMME" className="hover:text-gold-dark transition-colors">
                  Pour Femme
                </Link>
              </li>
              <li>
                <Link href="/produits?gender=UNISEXE" className="hover:text-gold-dark transition-colors">
                  Collections Unisexe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Service Client
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-stone-600">
              <li>Livraison Gratuite (Morocco-wide)</li>
              <li>Paiement à la livraison (COD)</li>
              <li>Support Clientèle H24</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-stone-600">
              <li>Email: contact@himmel.ma</li>
              <li>Tél: +212 6 94 33 81 63</li>
              <li>Fès, Maroc</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-300/60 pt-8 text-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Himmel Store. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
