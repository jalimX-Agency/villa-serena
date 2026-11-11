import type { LegalDoc } from "@/lib/legal";

/**
 * Terms of sale (CGV), text of the villa (draft of 8 Nov 2026, company details of 11 Nov).
 * Bracketed items not yet decided by the villa are worded without the missing figure; where V4
 * already decided (deposit hold on arrival day, card or transfer) its decision is used.
 * English translation by JalimX; the French version prevails.
 */

const MAIL = `<a href="mailto:guest@villaserenamarrakech.com">guest@villaserenamarrakech.com</a>`;

export const TERMS_FR = `
<h2>Article 1. Objet et parties</h2>
<p>Les présentes conditions générales de vente (CGV) régissent la location de la Villa Serena et des prestations associées, réservées sur le site villaserenamarrakech.com, par e-mail, par téléphone ou par WhatsApp.</p>
<p>La villa est exploitée par la société GAUTAMA, société à responsabilité limitée à associé unique (SARLAU) de droit marocain, au capital de 10 000 dirhams, immatriculée au registre du commerce de Marrakech sous le numéro 43769, ICE 001542315000080, dont le siège est situé 246 rue Kalitousa, Souk Tameslouhte, 43312 Tahannaout – Tameslouhte, Maroc, ci-après « la Villa Serena ».</p>
<p>Le « client » est la personne majeure qui effectue la réservation, en son nom et pour le compte de l'ensemble des hôtes qu'il déclare.</p>

<h2>Article 2. Acceptation des CGV et du règlement intérieur</h2>
<p>Toute réservation implique l'acceptation sans réserve des présentes CGV et du règlement intérieur de la Villa Serena, qui en fait partie intégrante. Le client les accepte en cochant la case prévue lors de sa demande, puis en versant l'acompte. La date, l'heure et la version des documents acceptés sont enregistrées.</p>
<p>Le client s'engage à porter le règlement intérieur à la connaissance de tous les hôtes et de ses éventuels invités, et se porte garant de son respect par eux.</p>

<h2>Article 3. Objet de la location</h2>
<p>La villa se loue uniquement en totalité et en exclusivité : le domaine d'un hectare, le riad de quatre suites, le pavillon de deux suites et le Studio indépendant, la piscine, le hammam, la salle de sport et le jardin.</p>
<p>La capacité d'hébergement est de 14 personnes au maximum, enfants compris. Le nombre d'hôtes indiqué lors de la réservation ne peut être dépassé sans l'accord écrit de la Villa Serena.</p>
<p>La location comprend :</p>
<ul>
<li>le petit-déjeuner chaque matin ;</li>
<li>le ménage quotidien ;</li>
<li>le linge de lit, le linge de toilette (serviettes et draps de bain), les serviettes de piscine et les produits d'accueil ;</li>
<li>le wifi par la fibre et le parking privé de 7 places ;</li>
<li>la présence du personnel décrit dans le règlement intérieur.</li>
</ul>
<p>La location est conclue à titre de résidence temporaire de vacances. Elle ne confère au client aucun droit au maintien dans les lieux à l'issue du séjour.</p>

<h2>Article 4. Prix</h2>
<p>Les prix sont indiqués en euros, toutes taxes comprises, pour la villa entière et par nuit. Ils varient selon la saison et la durée du séjour, à partir de 980 € TTC la nuit. Le prix applicable est celui de la proposition écrite (devis) adressée au client et acceptée par lui.</p>
<p>Ne sont pas compris dans le prix :</p>
<ul>
<li>la taxe de séjour, fixée à 25 dirhams par personne et par nuit pour les hôtes de 12 ans et plus, les moins de 12 ans en étant exonérés ;</li>
<li>les repas autres que le petit-déjeuner (article 5) ;</li>
<li>les prestations sur demande : soins au hammam, massages, transferts, excursions, événements, et toute prestation de partenaires extérieurs ;</li>
<li>le transport jusqu'à la villa.</li>
</ul>

<h2>Article 5. Repas</h2>
<p>Déjeuners et dîners sont préparés sur demande par la cuisinière de la maison. Ils sont servis à l'ensemble des hôtes à la même heure, aux horaires convenus avec la gouvernante. Le client choisit, pour son séjour, l'une des deux formules suivantes :</p>
<ul>
<li>Formule « menu » : un prix par repas et par personne, selon le menu choisi parmi les propositions de la gouvernante, avec un tarif enfant ; les tarifs sont communiqués sur demande.</li>
<li>Formule « courses au réel » : les achats sont refacturés au prix coûtant, sur présentation des justificatifs, et s'y ajoute un forfait de service par repas, communiqué sur demande.</li>
</ul>
<p>Les repas commandés sont réglés sur place, au plus tard la veille du départ, en euros ou en dirhams.</p>

<h2>Article 6. Réservation et paiement</h2>
<p>La réservation devient ferme à la réception, par la Villa Serena, de l'acompte de 50 % du prix du séjour. Une confirmation écrite est alors adressée au client.</p>
<p>Le solde, soit 50 % du prix du séjour, est payable au plus tard 30 jours avant la date d'arrivée. Pour toute réservation effectuée moins de 30 jours avant l'arrivée, la totalité du prix est due à la réservation.</p>
<p>Le paiement s'effectue par carte bancaire, sur la page de paiement sécurisée de notre prestataire, ou par virement bancaire. Les frais bancaires éventuels sont à la charge du client.</p>
<p>Si le solde n'est pas réglé à l'échéance, la Villa Serena adresse au client un rappel. Sans paiement dans un délai de 7 jours après ce rappel, la réservation est considérée comme annulée par le client, et l'article 7 s'applique.</p>

<h2>Article 7. Annulation par le client</h2>
<p>Toute annulation doit être notifiée par écrit (e-mail ou courrier). La date de réception de la notification détermine le montant remboursé. Sur les sommes déjà versées, la Villa Serena rembourse :</p>
<table>
<thead><tr><th>Date de l'annulation</th><th>Part remboursée</th></tr></thead>
<tbody>
<tr><td>90 jours ou plus avant l'arrivée</td><td>100 %</td></tr>
<tr><td>De 89 à 60 jours avant l'arrivée</td><td>70 %</td></tr>
<tr><td>De 59 à 14 jours avant l'arrivée</td><td>50 %</td></tr>
<tr><td>Moins de 14 jours avant l'arrivée</td><td>20 %</td></tr>
</tbody>
</table>
<p>Le remboursement intervient dans un délai de 30 jours suivant la notification.</p>
<p>Un séjour écourté ou une arrivée retardée, quel qu'en soit le motif, ne donne lieu à aucun remboursement. Il en va de même des nuits non utilisées.</p>
<p>Une réduction du nombre d'hôtes ne modifie pas le prix, celui-ci étant fixé pour la villa entière.</p>
<p>Nous recommandons vivement au client de souscrire une assurance annulation et une assurance voyage.</p>

<h2>Article 8. Caution</h2>
<p>Une caution de 1 500 € est demandée sous forme d'empreinte bancaire, c'est-à-dire une pré-autorisation sur la carte bancaire du client. Elle est effectuée le jour de l'arrivée. Aucune somme n'est débitée à ce stade.</p>
<p>L'empreinte est libérée dans un délai de 7 jours après le départ, après l'état des lieux de sortie.</p>
<p>En cas de dégradation, de perte, de casse, de nettoyage exceptionnel ou de manquement au règlement intérieur entraînant un coût pour la Villa Serena, le montant correspondant est prélevé sur la caution. Le client reçoit un justificatif : devis, facture ou photographies. Si le préjudice dépasse le montant de la caution, le client reste redevable de la différence.</p>

<h2>Article 9. Arrivée, départ et état des lieux</h2>
<p>L'arrivée a lieu à partir de 16 h, le départ avant 11 h. Une arrivée plus tôt ou un départ plus tard peut être accordé sur demande, selon les disponibilités et éventuellement contre supplément.</p>
<p>Le client communique l'heure prévue de son arrivée au plus tard 48 heures à l'avance. Un état des lieux et un inventaire sont réalisés avec le client à l'arrivée et au départ.</p>
<p>Conformément à la réglementation marocaine, l'identité de chaque hôte majeur est relevée à l'arrivée (pièce d'identité ou passeport).</p>

<h2>Article 10. Durée minimale de séjour</h2>
<p>La durée minimale de séjour est de 4 nuits, et de 6 nuits en haute saison et pendant les fêtes de fin d'année. Les dates de haute saison sont indiquées sur la proposition écrite adressée au client.</p>

<h2>Article 11. Événements privés</h2>
<p>L'organisation d'un événement réunissant des personnes autres que les hôtes déclarés (anniversaire, réception, séminaire, etc.) n'est possible qu'avec l'accord écrit préalable de la Villa Serena. L'événement fait l'objet d'un devis et de conditions particulières, qui précisent le nombre de participants (80 au maximum), les horaires, les prestataires et les éventuels frais supplémentaires.</p>
<p>Toute animation, pendant un événement ou un séjour, est soumise à l'autorisation écrite préalable de la Villa Serena. Le cas échéant, notamment en cas de risque d'incendie, elle ne peut avoir lieu qu'en présence d'un agent de sécurité incendie, dont le coût est à la charge du client. Pétards, feux d'artifice et lanternes volantes sont interdits.</p>
<p>Tout événement non déclaré peut entraîner l'application de l'article 15.</p>

<h2>Article 12. Animaux de compagnie</h2>
<p>Les animaux de compagnie ne sont acceptés qu'avec l'accord écrit préalable de la Villa Serena, donné lors de la réservation. Ils sont alors soumis aux règles du règlement intérieur. Un supplément par séjour peut être demandé ; son montant est indiqué lors de l'accord.</p>

<h2>Article 13. Annulation ou modification par la Villa Serena</h2>
<p>Si la Villa Serena doit annuler un séjour pour une cause qui lui est imputable, elle rembourse au client l'intégralité des sommes versées. Elle peut aussi, avec l'accord du client, proposer de reporter le séjour à d'autres dates.</p>
<p>En cas de force majeure au sens du droit marocain, rendant le séjour impossible (catastrophe naturelle, décision administrative, etc.), les parties recherchent de bonne foi un report du séjour. À défaut d'accord, les sommes versées sont remboursées, déduction faite des frais déjà engagés et justifiés.</p>

<h2>Article 14. Responsabilité et assurance</h2>
<p>Le client est responsable de tout dommage causé à la villa, à ses équipements, à son mobilier, à ses animaux et à ses plantations, par lui-même, par les hôtes ou par leurs invités. Il déclare être titulaire d'une assurance responsabilité civile couvrant son séjour.</p>
<p>La piscine n'est équipée ni de barrière de protection ni d'alarme, et n'est pas surveillée. Son accès se fait sous la seule responsabilité des hôtes. Les enfants mineurs doivent y être en permanence sous la surveillance d'un adulte responsable, conformément au règlement intérieur. Il en va de même pour la salle de sport, le hammam, la mini ferme et les volières.</p>
<p>La Villa Serena ne saurait être tenue responsable des vols ou pertes d'objets personnels, ni des prestations fournies par des partenaires extérieurs, qui restent responsables de leurs propres services.</p>
<p>Les coupures temporaires d'eau, d'électricité ou d'internet indépendantes de la volonté de la Villa Serena ne donnent lieu à aucune indemnité. La villa dispose d'un groupe électrogène.</p>

<h2>Article 15. Manquement au règlement intérieur</h2>
<p>En cas de manquement grave ou répété au règlement intérieur, notamment : dépassement de la capacité d'accueil, événement non autorisé, nuisances persistantes malgré un avertissement, mise en danger des personnes ou des animaux, dégradations volontaires, animation non autorisée, la Villa Serena peut mettre fin au séjour, sans remboursement des nuits restantes et sans préjudice des sommes dues au titre de l'article 8.</p>

<h2>Article 16. Réclamations et données personnelles</h2>
<p>Toute réclamation relative au séjour doit être signalée sur place à la gouvernante dès sa constatation, pour permettre d'y remédier. Elle doit ensuite, le cas échéant, être confirmée par écrit au plus tard 15 jours après le départ, à ${MAIL}.</p>
<p>Les données personnelles du client sont traitées conformément à la <a href="/fr/confidentialite">politique de confidentialité</a> publiée sur le site.</p>

<h2>Article 17. Droit applicable et litiges</h2>
<p>Les présentes CGV sont soumises au droit marocain. En cas de différend, les parties recherchent d'abord une solution amiable. À défaut, le litige est porté devant les tribunaux compétents de Marrakech, sous réserve des règles impératives de protection du consommateur applicables au client.</p>
`;

export const TERMS_EN = `
<p><em>Translation for information. In case of discrepancy, the French version prevails.</em></p>

<h2>Article 1. Purpose and parties</h2>
<p>These terms of sale govern the rental of Villa Serena and the related services, booked on the website villaserenamarrakech.com, by email, by phone or via WhatsApp.</p>
<p>The villa is operated by GAUTAMA, a Moroccan single-member limited liability company (SARLAU) with a share capital of 10,000 dirhams, registered with the Marrakech Trade Register under number 43769, ICE 001542315000080, with its registered office at 246 rue Kalitousa, Souk Tameslouhte, 43312 Tahannaout – Tameslouhte, Morocco, hereinafter "Villa Serena".</p>
<p>The "guest" is the adult who makes the booking, in their own name and on behalf of all the guests they declare.</p>

<h2>Article 2. Acceptance of the terms of sale and house rules</h2>
<p>Any booking implies full acceptance of these terms of sale and of the Villa Serena house rules, which form an integral part of them. The guest accepts them by ticking the box provided with their request, then by paying the deposit. The date, time and version of the documents accepted are recorded.</p>
<p>The guest undertakes to make the house rules known to all guests and any visitors, and is responsible for their compliance with them.</p>

<h2>Article 3. What is rented</h2>
<p>The villa is only rented in its entirety and exclusively: the one-hectare estate, the riad with four suites, the pavilion with two suites and the independent Studio, the pool, the hammam, the gym and the garden.</p>
<p>The maximum capacity is 14 people, children included. The number of guests stated when booking may not be exceeded without Villa Serena's written consent.</p>
<p>The rental includes:</p>
<ul>
<li>breakfast every morning;</li>
<li>daily housekeeping;</li>
<li>bed linen, bath linen (towels and bath sheets), pool towels and toiletries;</li>
<li>fibre Wi-Fi and private parking for 7 cars;</li>
<li>the presence of the staff described in the house rules.</li>
</ul>
<p>The rental is a temporary holiday residence. It gives the guest no right to remain on the premises after the stay.</p>

<h2>Article 4. Price</h2>
<p>Prices are given in euros, all taxes included, for the whole villa and per night. They vary with the season and the length of stay, from €980 incl. VAT per night. The applicable price is the one in the written proposal (quotation) sent to and accepted by the guest.</p>
<p>The price does not include:</p>
<ul>
<li>the tourist tax, set at 25 dirhams per person per night for guests aged 12 and over, under-12s being exempt;</li>
<li>meals other than breakfast (article 5);</li>
<li>services on request: hammam treatments, massages, transfers, excursions, events, and any service by outside partners;</li>
<li>transport to the villa.</li>
</ul>

<h2>Article 5. Meals</h2>
<p>Lunches and dinners are prepared on request by the house cook. They are served to all guests at the same time, at times agreed with the housekeeper. For their stay, the guest chooses one of the following two options:</p>
<ul>
<li>"Menu" option: a price per meal and per person, according to the menu chosen from the housekeeper's suggestions, with a children's rate; prices are given on request.</li>
<li>"Actual shopping" option: purchases are charged at cost, on presentation of receipts, plus a service fee per meal, given on request.</li>
</ul>
<p>Meals ordered are paid on site, no later than the day before departure, in euros or dirhams.</p>

<h2>Article 6. Booking and payment</h2>
<p>The booking becomes firm when Villa Serena receives the deposit of 50 % of the price of the stay. A written confirmation is then sent to the guest.</p>
<p>The balance, i.e. 50 % of the price of the stay, is payable no later than 30 days before the arrival date. For any booking made less than 30 days before arrival, the full price is due on booking.</p>
<p>Payment is made by card, on our provider's secure payment page, or by bank transfer. Any bank charges are borne by the guest.</p>
<p>If the balance is not paid when due, Villa Serena sends the guest a reminder. Without payment within 7 days of this reminder, the booking is considered cancelled by the guest, and article 7 applies.</p>

<h2>Article 7. Cancellation by the guest</h2>
<p>Any cancellation must be notified in writing (email or letter). The date the notice is received determines the amount refunded. Of the sums already paid, Villa Serena refunds:</p>
<table>
<thead><tr><th>Date of cancellation</th><th>Share refunded</th></tr></thead>
<tbody>
<tr><td>90 days or more before arrival</td><td>100 %</td></tr>
<tr><td>89 to 60 days before arrival</td><td>70 %</td></tr>
<tr><td>59 to 14 days before arrival</td><td>50 %</td></tr>
<tr><td>Less than 14 days before arrival</td><td>20 %</td></tr>
</tbody>
</table>
<p>The refund is made within 30 days of the notice.</p>
<p>A shortened stay or a late arrival, for whatever reason, gives no right to a refund. The same applies to unused nights.</p>
<p>A reduction in the number of guests does not change the price, which is set for the whole villa.</p>
<p>We strongly recommend that the guest take out cancellation insurance and travel insurance.</p>

<h2>Article 8. Security deposit</h2>
<p>A security deposit of €1,500 is required as a card pre-authorisation on the guest's bank card. It is made on the day of arrival. No amount is debited at this stage.</p>
<p>The pre-authorisation is released within 7 days of departure, after the check-out inspection.</p>
<p>In the event of damage, loss, breakage, exceptional cleaning or breach of the house rules causing a cost to Villa Serena, the corresponding amount is deducted from the deposit. The guest receives supporting evidence: quotation, invoice or photographs. If the loss exceeds the deposit, the guest remains liable for the difference.</p>

<h2>Article 9. Arrival, departure and inspection</h2>
<p>Check-in is from 4 pm, check-out before 11 am. An earlier arrival or later departure may be granted on request, subject to availability and possibly for an extra charge.</p>
<p>The guest gives their expected arrival time at least 48 hours in advance. An inspection and inventory are carried out with the guest on arrival and departure.</p>
<p>As required by Moroccan regulations, the identity of each adult guest is recorded on arrival (identity card or passport).</p>

<h2>Article 10. Minimum stay</h2>
<p>The minimum stay is 4 nights, and 6 nights in high season and over the Christmas and New Year holidays. High-season dates are shown in the written proposal sent to the guest.</p>

<h2>Article 11. Private events</h2>
<p>An event bringing together people other than the declared guests (birthday, reception, seminar, etc.) is only possible with Villa Serena's prior written consent. The event is subject to a quotation and specific conditions, stating the number of participants (80 at most), the times, the service providers and any additional costs.</p>
<p>Any entertainment, during an event or a stay, requires Villa Serena's prior written consent. Where applicable, in particular in case of fire risk, it may only take place in the presence of a fire safety officer, at the guest's expense. Firecrackers, fireworks and sky lanterns are forbidden.</p>
<p>Any undeclared event may lead to the application of article 15.</p>

<h2>Article 12. Pets</h2>
<p>Pets are only accepted with Villa Serena's prior written consent, given at the time of booking. They are then subject to the house rules. An extra charge per stay may apply; its amount is given with the consent.</p>

<h2>Article 13. Cancellation or change by Villa Serena</h2>
<p>If Villa Serena has to cancel a stay for a reason attributable to it, it refunds the guest all sums paid. It may also, with the guest's agreement, offer to move the stay to other dates.</p>
<p>In the event of force majeure under Moroccan law making the stay impossible (natural disaster, administrative decision, etc.), the parties seek in good faith to postpone the stay. Failing agreement, the sums paid are refunded, less costs already incurred and justified.</p>

<h2>Article 14. Liability and insurance</h2>
<p>The guest is liable for any damage caused to the villa, its equipment, furniture, animals and plantings, by themselves, by the guests or by their visitors. They declare that they hold third-party liability insurance covering their stay.</p>
<p>The pool has neither a safety barrier nor an alarm, and is not supervised. Access is at the guests' sole responsibility. Minors must be supervised at all times by a responsible adult, in accordance with the house rules. The same applies to the gym, the hammam, the mini farm and the aviaries.</p>
<p>Villa Serena cannot be held liable for theft or loss of personal belongings, nor for services provided by outside partners, who remain responsible for their own services.</p>
<p>Temporary interruptions of water, electricity or internet beyond Villa Serena's control give no right to compensation. The villa has a backup generator.</p>

<h2>Article 15. Breach of the house rules</h2>
<p>In the event of a serious or repeated breach of the house rules, in particular: exceeding the capacity, an unauthorised event, persistent nuisance despite a warning, endangering people or animals, wilful damage, unauthorised entertainment, Villa Serena may end the stay, without refund of the remaining nights and without prejudice to the sums due under article 8.</p>

<h2>Article 16. Complaints and personal data</h2>
<p>Any complaint about the stay must be reported on site to the housekeeper as soon as it is noticed, so that it can be remedied. Where applicable, it must then be confirmed in writing no later than 15 days after departure, to ${MAIL}.</p>
<p>The guest's personal data is processed in accordance with the <a href="/en/privacy">privacy policy</a> published on the website.</p>

<h2>Article 17. Governing law and disputes</h2>
<p>These terms of sale are governed by Moroccan law. In the event of a dispute, the parties first seek an amicable solution. Failing that, the dispute is brought before the competent courts of Marrakech, subject to the mandatory consumer protection rules applicable to the guest.</p>
`;

/** Document bodies as trusted HTML, per locale (server only: kept out of the client bundles). */
export const LEGAL_TEXT: Record<LegalDoc, { fr: string; en: string }> = {
  rules: { fr: "", en: "" },
  terms: { fr: TERMS_FR, en: TERMS_EN },
};
