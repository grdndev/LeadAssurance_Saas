import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CGUPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-secondary/30">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <Card className="border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Conditions Générales d'Utilisation</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Dernière mise à jour : 13 février 2026</p>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <h2>1. Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités et conditions dans lesquelles LeadsAssurance.com met à disposition sa plateforme de mise en relation entre courtiers en assurance et apporteurs d'affaires.
              </p>

              <h2>2. Acceptation des CGU</h2>
              <p>
                L'utilisation de la plateforme LeadsAssurance.com implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.
              </p>

              <h2>3. Inscription et compte utilisateur</h2>
              <p>
                Pour accéder aux services de LeadsAssurance.com, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.
              </p>
              <ul>
                <li>Les courtiers doivent fournir leur numéro ORIAS valide</li>
                <li>Les apporteurs doivent fournir un numéro SIRET valide</li>
                <li>Toute information frauduleuse entraînera la suspension immédiate du compte</li>
              </ul>

              <h2>4. Services proposés</h2>
              <p>
                LeadsAssurance.com propose une marketplace permettant :
              </p>
              <ul>
                <li>L'achat et la vente de leads qualifiés en assurance et crédit</li>
                <li>La mise en relation entre courtiers et apporteurs d'affaires</li>
                <li>La gestion des consentements RGPD</li>
                <li>Le suivi des transactions et des crédits</li>
              </ul>

              <h2>5. Tarification et paiement</h2>
              <p>
                Les prix des leads sont affichés en euros TTC. Le paiement s'effectue par carte bancaire via notre prestataire de paiement sécurisé Stripe. Les courtiers achètent des crédits qui peuvent ensuite être utilisés pour acquérir des leads.
              </p>

              <h2>6. Conformité RGPD et ACPR</h2>
              <p>
                Tous les leads disponibles sur la plateforme sont accompagnés d'une preuve de consentement conforme au RGPD. Les utilisateurs s'engagent à respecter la réglementation ACPR en matière d'intermédiation en assurance.
              </p>

              <h2>7. Garanties et litiges</h2>
              <p>
                LeadsAssurance.com garantit la qualité des leads commercialisés. En cas de problème, un système de litige permet de signaler les leads non conformes dans un délai de 72 heures suivant l'achat.
              </p>

              <h2>8. Responsabilités</h2>
              <p>
                LeadsAssurance.com agit en tant qu'intermédiaire et ne peut être tenu responsable de la qualité des relations commerciales entre courtiers et prospects. Les utilisateurs restent seuls responsables de leurs actions commerciales.
              </p>

              <h2>9. Propriété intellectuelle</h2>
              <p>
                Tous les contenus présents sur LeadsAssurance.com (textes, images, logos, etc.) sont protégés par le droit de la propriété intellectuelle et appartiennent à LeadsAssurance.com ou à ses partenaires.
              </p>

              <h2>10. Modification des CGU</h2>
              <p>
                LeadsAssurance.com se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par email.
              </p>

              <h2>11. Résiliation</h2>
              <p>
                Chaque partie peut résilier son compte à tout moment. En cas de résiliation, les crédits restants peuvent être remboursés sous conditions, déduction faite des frais de gestion.
              </p>

              <h2>12. Droit applicable et juridiction</h2>
              <p>
                Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou leur exécution relève de la compétence exclusive des tribunaux français.
              </p>

              <h2>13. Contact</h2>
              <p>
                Pour toute question concernant les présentes CGU, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@leadsassurance.com" className="text-primary hover:underline">contact@leadsassurance.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
