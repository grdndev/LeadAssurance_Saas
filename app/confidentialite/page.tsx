import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfidentialitePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-secondary/30">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <Card className="border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Politique de Confidentialité</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Dernière mise à jour : 13 février 2026</p>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <h2>1. Introduction</h2>
              <p>
                LeadsAssurance.com s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>

              <h2>2. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données est LeadsAssurance.com. Pour toute question relative à la protection de vos données, vous pouvez nous contacter à : <a href="mailto:dpo@leadsassurance.com" className="text-primary hover:underline">dpo@leadsassurance.com</a>
              </p>

              <h2>3. Données collectées</h2>
              <p>Nous collectons les données suivantes :</p>
              <ul>
                <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                <li><strong>Données professionnelles :</strong> numéro ORIAS, SIRET, raison sociale</li>
                <li><strong>Données de connexion :</strong> adresse IP, logs de connexion, cookies</li>
                <li><strong>Données de transaction :</strong> historique des achats, crédits, factures</li>
                <li><strong>Données bancaires :</strong> traitées uniquement par notre prestataire de paiement Stripe (nous ne conservons pas vos coordonnées bancaires)</li>
              </ul>

              <h2>4. Finalités du traitement</h2>
              <p>Vos données sont traitées pour :</p>
              <ul>
                <li>La création et la gestion de votre compte utilisateur</li>
                <li>La fourniture de nos services de marketplace de leads</li>
                <li>Le traitement des paiements et la facturation</li>
                <li>La conformité réglementaire (RGPD, ACPR)</li>
                <li>L'amélioration de nos services</li>
                <li>La communication d'informations importantes relatives à nos services</li>
                <li>La prévention de la fraude et la sécurité de la plateforme</li>
              </ul>

              <h2>5. Base légale du traitement</h2>
              <p>
                Le traitement de vos données repose sur :
              </p>
              <ul>
                <li>L'exécution du contrat : pour fournir nos services</li>
                <li>Le respect d'obligations légales : conformité RGPD, ACPR, obligations fiscales</li>
                <li>Votre consentement : pour les communications marketing (révocable à tout moment)</li>
                <li>Notre intérêt légitime : amélioration de nos services et prévention de la fraude</li>
              </ul>

              <h2>6. Durée de conservation</h2>
              <p>
                Nous conservons vos données personnelles pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
              </p>
              <ul>
                <li>Données de compte : durée de la relation contractuelle + 3 ans</li>
                <li>Données de transaction : 10 ans (obligation légale comptable et fiscale)</li>
                <li>Données de consentement : durée légale de conservation des preuves de consentement</li>
                <li>Cookies : 13 mois maximum</li>
              </ul>

              <h2>7. Destinataires des données</h2>
              <p>Vos données peuvent être transmises à :</p>
              <ul>
                <li>Les équipes internes de LeadsAssurance.com</li>
                <li>Nos prestataires techniques (hébergement, paiement, emailing)</li>
                <li>Les autorités compétentes en cas d'obligation légale</li>
                <li>Les courtiers acheteurs de leads (uniquement les données du lead)</li>
              </ul>
              <p>
                Tous nos prestataires sont soumis à des obligations de confidentialité et de sécurité strictes.
              </p>

              <h2>8. Transferts de données hors UE</h2>
              <p>
                Certains de nos prestataires peuvent être situés hors de l'Union Européenne. Dans ce cas, nous veillons à ce que des garanties appropriées soient mises en place (clauses contractuelles types de la Commission Européenne).
              </p>

              <h2>9. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction :
              </p>
              <ul>
                <li>Chiffrement des données en transit (HTTPS/TLS)</li>
                <li>Chiffrement des données au repos</li>
                <li>Authentification sécurisée (hachage des mots de passe)</li>
                <li>Contrôles d'accès stricts</li>
                <li>Sauvegardes régulières</li>
                <li>Tests de sécurité réguliers</li>
              </ul>

              <h2>10. Vos droits</h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul>
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données dans certaines conditions</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                <li><strong>Droit de retirer votre consentement :</strong> pour les traitements basés sur le consentement</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à : <a href="mailto:dpo@leadsassurance.com" className="text-primary hover:underline">dpo@leadsassurance.com</a>
              </p>

              <h2>11. Cookies</h2>
              <p>
                Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur.
              </p>
              <p>Types de cookies utilisés :</p>
              <ul>
                <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
                <li><strong>Cookies de performance :</strong> analyse de l'utilisation du site</li>
                <li><strong>Cookies fonctionnels :</strong> mémorisation de vos préférences</li>
              </ul>

              <h2>12. Réclamation</h2>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
              </p>
              <p>
                <strong>CNIL</strong><br />
                3 Place de Fontenoy<br />
                TSA 80715<br />
                75334 PARIS CEDEX 07<br />
                Tél : 01 53 73 22 22<br />
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
              </p>

              <h2>13. Modifications</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page.
              </p>

              <h2>14. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité, contactez notre Délégué à la Protection des Données :
              </p>
              <p>
                Email : <a href="mailto:dpo@leadsassurance.com" className="text-primary hover:underline">dpo@leadsassurance.com</a><br />
                Adresse : LeadsAssurance.com - Service DPO
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
