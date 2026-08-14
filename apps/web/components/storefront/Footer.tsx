import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-black py-16 text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col">
              <span className="font-heading text-xl  font-bold tracking-widest text-gold transition-colors  sm:text-2xl">
                HIMMEL
              </span>
              <span className="font-heading text-xs uppercase  w-fit ml-8 tracking-wide">
                fatima zahrae derkaoui
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Votre destination ultime pour les parfums de luxe et de niche au Maroc. L'excellence olfactive livrée chez vous.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
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

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Service Client
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>Livraison Gratuite (Morocco-wide)</li>
              <li>Paiement à la livraison (COD)</li>
              <li>Support Clientèle H24</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>Email: contact@himmel.ma</li>
              <li>Tél: +212 6 12 34 56 78</li>
              <li>Casablanca, Maroc</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Himmel Store. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
