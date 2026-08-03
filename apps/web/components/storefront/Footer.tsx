import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-16 text-zinc-500">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <span className="font-heading text-xl font-bold tracking-widest text-gold">
              HIMMEL
            </span>
            <p className="text-sm leading-relaxed text-zinc-400">
              Votre destination ultime pour les parfums de luxe et de niche au Maroc. L'excellence olfactive livrée chez vous.
            </p>
          </div>

          {/* Links: Boutique */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Boutique
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <Link href="/produits" className="hover:text-gold transition-colors">
                  Tous les parfums
                </Link>
              </li>
              <li>
                <Link href="/produits?gender=HOMME" className="hover:text-gold transition-colors">
                  Pour Homme
                </Link>
              </li>
              <li>
                <Link href="/produits?gender=FEMME" className="hover:text-gold transition-colors">
                  Pour Femme
                </Link>
              </li>
              <li>
                <Link href="/produits?gender=UNISEXE" className="hover:text-gold transition-colors">
                  Collections Unisexe
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Service Client
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <span className="text-zinc-400">Livraison Gratuite (Morocco-wide)</span>
              </li>
              <li>
                <span className="text-zinc-400">Paiement à la livraison (COD)</span>
              </li>
              <li>
                <span className="text-zinc-400">Support Clientèle H24</span>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
              <li>
                <span>Email: contact@himmel.ma</span>
              </li>
              <li>
                <span>Tél: +212 6 12 34 56 78</span>
              </li>
              <li>
                <span>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Himmel Store. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
