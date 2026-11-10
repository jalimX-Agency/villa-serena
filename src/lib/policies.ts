/**
 * Privacy and cookie policies (texts supplied by the villa on 8 Nov 2026, FR and EN).
 * Details the villa has not sent yet are left out of the published text: fill COMPANY and
 * PRIVACY_EMAIL below and the sentences complete themselves.
 */

export const POLICY_UPDATED = { fr: "9 novembre 2026", en: "9 November 2026" };

/** Company identifiers, published once known (capital in dirhams, trade register no., ICE, registered office). */
export const COMPANY = { capital: "", rc: "", ice: "", office: "", /** Director of publication (legal notice). */ publisher: "" };

/** Dedicated address for data requests; until then, the villa's general address. */
export const PRIVACY_EMAIL = "guest@villaserenamarrakech.com";

const mail = `<a href="mailto:${PRIVACY_EMAIL}">${PRIVACY_EMAIL}</a>`;

function companyFr() {
  const parts = [
    COMPANY.capital && `au capital de ${COMPANY.capital} dirhams`,
    COMPANY.rc && `immatriculée au registre du commerce de Marrakech sous le numéro ${COMPANY.rc}`,
    COMPANY.ice && `ICE ${COMPANY.ice}`,
    COMPANY.office && `dont le siège est situé ${COMPANY.office}`,
  ].filter(Boolean);
  return parts.length ? `, ${parts.join(", ")}` : "";
}

function companyEn() {
  const parts = [
    COMPANY.capital && `with a share capital of ${COMPANY.capital} dirhams`,
    COMPANY.rc && `registered with the Marrakech Trade Register under number ${COMPANY.rc}`,
    COMPANY.ice && `ICE ${COMPANY.ice}`,
    COMPANY.office && `with its registered office at ${COMPANY.office}`,
  ].filter(Boolean);
  return parts.length ? `, ${parts.join(", ")}` : "";
}

export function privacyHtml(locale: string) {
  return locale === "en" ? PRIVACY_EN() : PRIVACY_FR();
}

export function cookiesHtml(locale: string) {
  return locale === "en" ? COOKIES_EN : COOKIES_FR;
}

/** Legal notice (mentions légales), draft to be validated by the villa. */
export function legalNoticeHtml(locale: string) {
  const en = locale === "en";
  const pub = COMPANY.publisher;
  return en
    ? `
<h2>Publisher</h2>
<p>The website villaserenamarrakech.com is published by GAUTAMA, a Moroccan single-member limited liability company (SARLAU)${companyEn()}, which operates Villa Serena, Ourika road, km 17, Sidi Bouzguia, Marrakech, Morocco.</p>
<p>Phone: +212 663 524 991. Email: ${mail}.</p>
${pub ? `<p>Director of publication: ${pub}.</p>` : ""}
<h2>Hosting</h2>
<p>Website: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com). Images: Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United States (cloudflare.com).</p>
<h2>Design and development</h2>
<p>JalimX Agency.</p>
<h2>Intellectual property</h2>
<p>The texts, photographs, logo and visual elements of this website belong to GAUTAMA or are used with their authors' permission. Any reproduction, even partial, requires prior written consent.</p>
<h2>Personal data and cookies</h2>
<p>See our <a href="/en/privacy">privacy policy</a> and our <a href="/en/cookies">cookie policy</a>.</p>
<h2>Information on the website</h2>
<p>We take care to keep the information on this website accurate and up to date. Prices and conditions of a stay are those of the written proposal sent to the guest and of our terms of sale.</p>
`
    : `
<h2>Éditeur du site</h2>
<p>Le site villaserenamarrakech.com est édité par la société GAUTAMA, société à responsabilité limitée à associé unique (SARLAU) de droit marocain${companyFr()}, qui exploite la Villa Serena, route de l'Ourika, km 17, Sidi Bouzguia, Marrakech, Maroc.</p>
<p>Téléphone : +212 663 524 991. E-mail : ${mail}.</p>
${pub ? `<p>Directeur de la publication : ${pub}.</p>` : ""}
<h2>Hébergement</h2>
<p>Site : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com). Images : Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis (cloudflare.com).</p>
<h2>Conception et réalisation</h2>
<p>JalimX Agency.</p>
<h2>Propriété intellectuelle</h2>
<p>Les textes, photographies, logo et éléments graphiques de ce site appartiennent à la société GAUTAMA ou sont utilisés avec l'accord de leurs auteurs. Toute reproduction, même partielle, est soumise à une autorisation écrite préalable.</p>
<h2>Données personnelles et cookies</h2>
<p>Consultez notre <a href="/fr/confidentialite">politique de confidentialité</a> et notre <a href="/fr/cookies">politique cookies</a>.</p>
<h2>Informations du site</h2>
<p>Nous veillons à l'exactitude et à la mise à jour des informations publiées. Les prix et les conditions d'un séjour sont ceux de la proposition écrite adressée au client et de nos conditions générales de vente.</p>
`;
}

const PRIVACY_FR = () => `
<p>La Villa Serena attache une grande importance à la protection de vos données personnelles. Cette page explique quelles données nous recueillons lorsque vous utilisez le site villaserenamarrakech.com, pourquoi nous les utilisons, combien de temps nous les conservons et comment exercer vos droits.</p>

<h2>Qui est responsable de vos données ?</h2>
<p>Le responsable du traitement est la société GAUTAMA, société à responsabilité limitée à associé unique (SARLAU) de droit marocain${companyFr()}. Elle exploite la Villa Serena, route de l'Ourika, km 17, Sidi Bouzguia, Marrakech, Maroc.</p>
<p>Pour toute question sur vos données : ${mail}.</p>

<h2>Quelles données recueillons-nous ?</h2>
<p>Nous ne recueillons que les données que vous nous transmettez vous-même, ainsi que des données techniques limitées :</p>
<ul>
<li>par le formulaire de demande ou de réservation : votre nom complet, votre adresse e-mail, votre numéro de téléphone ou WhatsApp, les dates de séjour souhaitées, le nombre d'hôtes et, si vous le souhaitez, votre message ;</li>
<li>lors de l'envoi du formulaire : la date, l'heure et la version des conditions générales de vente et du règlement intérieur que vous avez acceptés ;</li>
<li>lorsque vous nous écrivez par e-mail ou par WhatsApp : les informations contenues dans vos messages ;</li>
<li>lors de votre navigation : des données techniques (adresse IP, type de navigateur, pages consultées) enregistrées automatiquement par notre hébergeur pour assurer le fonctionnement et la sécurité du site, ainsi que les cookies décrits dans notre <a href="/fr/cookies">politique cookies</a>.</li>
</ul>
<p>Nous ne vous demandons aucune donnée bancaire sur le site, ni aucune donnée sensible.</p>

<h2>Pourquoi utilisons-nous vos données ?</h2>
<table class="plain">
<thead><tr><th>Finalité</th><th>Fondement</th></tr></thead>
<tbody>
<tr><td>Répondre à votre demande et vous adresser une proposition de séjour</td><td>Votre demande, avant la conclusion du contrat</td></tr>
<tr><td>Gérer votre réservation, votre séjour et le paiement</td><td>L'exécution du contrat de location</td></tr>
<tr><td>Conserver la preuve de votre acceptation des conditions générales de vente et du règlement intérieur</td><td>Notre intérêt légitime à pouvoir prouver les conditions acceptées</td></tr>
<tr><td>Respecter nos obligations comptables, fiscales et administratives</td><td>Nos obligations légales</td></tr>
<tr><td>Assurer la sécurité et le bon fonctionnement du site</td><td>Notre intérêt légitime</td></tr>
<tr><td>Mesurer la fréquentation du site</td><td>Votre accord, donné dans le bandeau cookies</td></tr>
<tr><td>Vous envoyer nos actualités ou offres</td><td>Uniquement avec votre accord préalable, que vous pouvez retirer à tout moment</td></tr>
</tbody>
</table>
<p>Vos données ne sont jamais vendues ni louées.</p>

<h2>Qui a accès à vos données ?</h2>
<p>Vos données sont destinées à l'équipe de la Villa Serena chargée des réservations. Elles peuvent être transmises, uniquement pour les besoins décrits ci-dessus, à nos prestataires techniques, qui agissent sur nos instructions :</p>
<ul>
<li>l'hébergeur du site : Vercel Inc., États-Unis (vercel.com) ;</li>
<li>la base de données du site : Neon Inc., États-Unis (neon.tech) ;</li>
<li>notre prestataire d'envoi d'e-mails : Resend Inc., États-Unis (resend.com) ;</li>
<li>l'agence chargée de la maintenance du site : JalimX Agency ;</li>
<li>Google (Google Analytics et Google Maps), uniquement si vous l'acceptez dans le bandeau cookies.</li>
</ul>
<p>Si vous nous contactez par WhatsApp, vos échanges passent aussi par les services de WhatsApp (Meta), selon ses propres conditions.</p>
<p>Certains de ces prestataires sont situés hors du Maroc, notamment aux États-Unis. Ces transferts sont encadrés par des garanties contractuelles appropriées.</p>

<h2>Combien de temps conservons-nous vos données ?</h2>
<ul>
<li>Demande sans réservation : 3 ans à compter de notre dernier échange.</li>
<li>Réservation : pendant la durée de la relation contractuelle, puis 10 ans pour les pièces comptables et fiscales.</li>
<li>Preuve d'acceptation des conditions générales de vente et du règlement intérieur : 5 ans après la fin du séjour.</li>
<li>Données techniques de connexion : la durée fixée par l'hébergeur, au plus 12 mois.</li>
</ul>
<p>À l'issue de ces durées, vos données sont supprimées ou rendues anonymes.</p>

<h2>Vos droits</h2>
<p>Conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition, pour des motifs légitimes, au traitement de vos données.</p>
<p>Si vous résidez dans l'Union européenne, vous disposez en outre, dans les conditions prévues par le Règlement général sur la protection des données (RGPD), d'un droit à l'effacement, à la limitation du traitement et à la portabilité de vos données, ainsi que du droit de retirer à tout moment votre consentement.</p>
<p>Pour exercer ces droits, écrivez-nous à ${mail}, en précisant l'objet de votre demande. Nous vous répondrons dans un délai d'un mois. Nous pourrons vous demander de justifier de votre identité en cas de doute raisonnable.</p>
<p>Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez saisir la Commission nationale de contrôle de la protection des données à caractère personnel (CNDP, <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer">www.cndp.ma</a>) ou, si vous résidez dans l'Union européenne, l'autorité de protection des données de votre pays (en France, la CNIL, <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).</p>

<h2>Sécurité</h2>
<p>Nous prenons les mesures techniques et organisationnelles appropriées pour protéger vos données : connexion chiffrée (HTTPS), accès limité aux seules personnes qui en ont besoin, et prestataires choisis pour leurs garanties de sécurité.</p>

<h2>Mineurs</h2>
<p>Les réservations sont réservées aux personnes majeures. Le site ne collecte pas sciemment de données concernant des mineurs, en dehors du nombre d'hôtes indiqué par la personne qui réserve.</p>

<h2>Cookies</h2>
<p>Le site utilise des cookies. Leur fonctionnement et la manière de les accepter ou de les refuser sont expliqués dans notre <a href="/fr/cookies">politique cookies</a>.</p>

<h2>Modification de cette politique</h2>
<p>Nous pouvons mettre à jour cette politique, notamment en cas d'évolution du site ou de la réglementation. La date de dernière mise à jour figure en haut de la page.</p>
`;

const PRIVACY_EN = () => `
<p>Villa Serena takes the protection of your personal data seriously. This page explains what data we collect when you use villaserenamarrakech.com, why we use it, how long we keep it and how you can exercise your rights.</p>

<h2>Who is responsible for your data?</h2>
<p>The data controller is GAUTAMA, a Moroccan single-member limited liability company (SARLAU)${companyEn()}. GAUTAMA operates Villa Serena, Ourika road, km 17, Sidi Bouzguia, Marrakech, Morocco.</p>
<p>For any question about your data: ${mail}.</p>

<h2>What data do we collect?</h2>
<p>We only collect the data you give us yourself, together with limited technical data:</p>
<ul>
<li>through the enquiry or booking form: your full name, email address, phone or WhatsApp number, preferred dates, number of guests and, if you wish, your message;</li>
<li>when you submit the form: the date, time and version of the terms of sale and house rules you accepted;</li>
<li>when you write to us by email or WhatsApp: the information contained in your messages;</li>
<li>while you browse: technical data (IP address, browser type, pages visited) automatically recorded by our hosting provider to run and secure the website, and the cookies described in our <a href="/en/cookies">cookie policy</a>.</li>
</ul>
<p>We never ask for bank details or sensitive data on the website.</p>

<h2>Why do we use your data?</h2>
<table class="plain">
<thead><tr><th>Purpose</th><th>Legal basis</th></tr></thead>
<tbody>
<tr><td>Answering your enquiry and sending you a stay proposal</td><td>Your request, before entering into a contract</td></tr>
<tr><td>Managing your booking, stay and payment</td><td>Performance of the rental contract</td></tr>
<tr><td>Keeping proof that you accepted the terms of sale and house rules</td><td>Our legitimate interest in being able to prove the accepted terms</td></tr>
<tr><td>Meeting our accounting, tax and administrative obligations</td><td>Our legal obligations</td></tr>
<tr><td>Keeping the website secure and working properly</td><td>Our legitimate interest</td></tr>
<tr><td>Measuring website traffic</td><td>Your consent, given in the cookie banner</td></tr>
<tr><td>Sending you news or offers</td><td>Only with your prior consent, which you may withdraw at any time</td></tr>
</tbody>
</table>
<p>Your data is never sold or rented.</p>

<h2>Who has access to your data?</h2>
<p>Your data is intended for the Villa Serena booking team. It may be shared, solely for the purposes above, with our technical service providers acting on our instructions:</p>
<ul>
<li>website hosting: Vercel Inc., United States (vercel.com);</li>
<li>website database: Neon Inc., United States (neon.tech);</li>
<li>email delivery provider: Resend Inc., United States (resend.com);</li>
<li>web agency in charge of website maintenance: JalimX Agency;</li>
<li>Google (Google Analytics and Google Maps), only if you accept it in the cookie banner.</li>
</ul>
<p>If you contact us via WhatsApp, your messages also go through WhatsApp (Meta) services, under its own terms.</p>
<p>Some of these providers are located outside Morocco, in particular in the United States. These transfers are covered by appropriate contractual safeguards.</p>

<h2>How long do we keep your data?</h2>
<ul>
<li>Enquiry without booking: 3 years from our last exchange.</li>
<li>Booking: for the duration of the contractual relationship, then 10 years for accounting and tax records.</li>
<li>Proof of acceptance of the terms of sale and house rules: 5 years after the end of the stay.</li>
<li>Technical connection data: the period set by the hosting provider, no more than 12 months.</li>
</ul>
<p>After these periods, your data is deleted or anonymised.</p>

<h2>Your rights</h2>
<p>Under Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data, you have the right to access and rectify your data, and to object, on legitimate grounds, to its processing.</p>
<p>If you live in the European Union, you also have, under the conditions set by the General Data Protection Regulation (GDPR), the right to erasure, to restriction of processing and to data portability, as well as the right to withdraw your consent at any time.</p>
<p>To exercise these rights, write to us at ${mail}, stating the purpose of your request. We will reply within one month and may ask you to prove your identity if there is reasonable doubt.</p>
<p>If, after contacting us, you believe your rights have not been respected, you may lodge a complaint with the Moroccan data protection authority (CNDP, <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer">www.cndp.ma</a>) or, if you live in the European Union, with the data protection authority of your country.</p>

<h2>Security</h2>
<p>We take appropriate technical and organisational measures to protect your data: encrypted connection (HTTPS), access limited to the people who need it, and service providers chosen for their security guarantees.</p>

<h2>Minors</h2>
<p>Bookings may only be made by adults. The website does not knowingly collect data about minors, other than the number of guests stated by the person making the booking.</p>

<h2>Cookies</h2>
<p>The website uses cookies. How they work and how to accept or refuse them is explained in our <a href="/en/cookies">cookie policy</a>.</p>

<h2>Changes to this policy</h2>
<p>We may update this policy, in particular if the website or the regulations change. The date of the last update appears at the top of the page.</p>
`;

const COOKIES_FR = `
<p>Cette page explique ce que sont les cookies, lesquels sont utilisés sur le site villaserenamarrakech.com, et comment vous pouvez les accepter ou les refuser. Le site est édité par la société GAUTAMA SARLAU, exploitante de la Villa Serena (voir notre <a href="/fr/confidentialite">politique de confidentialité</a>).</p>

<h2>Qu'est-ce qu'un cookie ?</h2>
<p>Un cookie est un petit fichier enregistré sur votre ordinateur, votre tablette ou votre téléphone lorsque vous consultez un site. Il permet par exemple de mémoriser vos choix ou de mesurer la fréquentation du site.</p>

<h2>Les cookies que nous utilisons</h2>
<h3>Cookies strictement nécessaires (toujours actifs)</h3>
<p>Ils permettent au site de fonctionner et de mémoriser votre choix concernant les cookies. Ils ne nécessitent pas votre accord.</p>
<table>
<thead><tr><th>Cookie</th><th>Finalité</th><th>Durée</th></tr></thead>
<tbody>
<tr><td>vs_consent</td><td>Mémoriser votre choix sur les cookies</td><td>6 mois</td></tr>
<tr><td>NEXT_LOCALE</td><td>Mémoriser la langue choisie (français ou anglais)</td><td>Session</td></tr>
</tbody>
</table>

<h3>Contenus de tiers : carte Google Maps (soumis à votre accord)</h3>
<p>La page La villa présente une carte Google Maps pour situer la villa. Lorsque vous l'affichez, Google peut déposer des cookies et recueillir des données de navigation, selon sa propre politique de confidentialité (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>). La carte ne se charge qu'avec votre accord ; sans accord, vous voyez une simple image et pouvez l'afficher d'un clic.</p>

<h3>Mesure d'audience (soumis à votre accord)</h3>
<p>Avec votre accord, nous utilisons Google Analytics pour savoir combien de personnes consultent le site et quelles pages les intéressent. Ces statistiques nous aident à améliorer le site. Les adresses IP ne sont pas conservées par Google Analytics 4.</p>
<table>
<thead><tr><th>Cookie</th><th>Finalité</th><th>Durée</th></tr></thead>
<tbody>
<tr><td>_ga</td><td>Distinguer les visiteurs, de façon statistique</td><td>13 mois</td></tr>
<tr><td>_ga_&lt;identifiant&gt;</td><td>Conserver l'état de la session de visite</td><td>13 mois</td></tr>
</tbody>
</table>

<h3>Liens vers les réseaux sociaux</h3>
<p>Les boutons Instagram, Facebook et WhatsApp sont de simples liens. Ils ne déposent aucun cookie tant que vous ne cliquez pas dessus. Une fois sur ces plateformes, leurs propres politiques s'appliquent.</p>

<h2>Comment accepter ou refuser les cookies ?</h2>
<p>Lors de votre première visite, un bandeau vous permet de tout accepter, de tout refuser ou de choisir catégorie par catégorie. Refuser n'a aucune conséquence sur votre accès au site ; seules la carte et la mesure d'audience ne seront pas activées.</p>
<p>Votre choix est conservé pendant 6 mois. Vous pouvez le modifier à tout moment grâce au lien « Gérer mes cookies » en bas de chaque page.</p>
<p>Vous pouvez aussi bloquer ou supprimer les cookies dans les réglages de votre navigateur. Dans ce cas, certaines fonctions du site, comme la carte, peuvent ne pas s'afficher.</p>

<h2>En savoir plus</h2>
<p>Pour toute question, écrivez-nous à ${mail}. Pour en savoir plus sur vos droits, consultez notre <a href="/fr/confidentialite">politique de confidentialité</a>.</p>
`;

const COOKIES_EN = `
<p>This page explains what cookies are, which ones are used on villaserenamarrakech.com, and how you can accept or refuse them. The website is published by GAUTAMA SARLAU, which operates Villa Serena (see our <a href="/en/privacy">privacy policy</a>).</p>

<h2>What is a cookie?</h2>
<p>A cookie is a small file stored on your computer, tablet or phone when you visit a website. It can, for example, remember your choices or measure how the website is used.</p>

<h2>The cookies we use</h2>
<h3>Strictly necessary cookies (always active)</h3>
<p>They allow the website to work and remember your cookie choice. They do not require your consent.</p>
<table>
<thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead>
<tbody>
<tr><td>vs_consent</td><td>Remember your cookie choice</td><td>6 months</td></tr>
<tr><td>NEXT_LOCALE</td><td>Remember your language (French or English)</td><td>Session</td></tr>
</tbody>
</table>

<h3>Third-party content: Google Maps (subject to your consent)</h3>
<p>The Villa page shows a Google Maps map to locate the villa. When you display it, Google may set cookies and collect browsing data under its own privacy policy (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>). The map only loads with your consent; without it, you see a simple image and can display the map with one click.</p>

<h3>Audience measurement (subject to your consent)</h3>
<p>With your consent, we use Google Analytics to know how many people visit the website and which pages interest them. These statistics help us improve the website. IP addresses are not stored by Google Analytics 4.</p>
<table>
<thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead>
<tbody>
<tr><td>_ga</td><td>Distinguish visitors, statistically</td><td>13 months</td></tr>
<tr><td>_ga_&lt;ID&gt;</td><td>Keep the state of the visit session</td><td>13 months</td></tr>
</tbody>
</table>

<h3>Links to social networks</h3>
<p>The Instagram, Facebook and WhatsApp buttons are simple links. They set no cookies until you click on them. Once on those platforms, their own policies apply.</p>

<h2>How to accept or refuse cookies</h2>
<p>On your first visit, a banner lets you accept all, refuse all or choose category by category. Refusing has no effect on your access to the website; only the map and audience measurement will not be activated.</p>
<p>Your choice is kept for 6 months. You can change it at any time with the "Manage cookies" link at the bottom of every page.</p>
<p>You can also block or delete cookies in your browser settings. In that case, some features, such as the map, may not display.</p>

<h2>Find out more</h2>
<p>For any question, write to us at ${mail}. To learn more about your rights, see our <a href="/en/privacy">privacy policy</a>.</p>
`;
