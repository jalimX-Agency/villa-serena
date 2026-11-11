import { SITE_URL } from "@/lib/seo";
import { LEGAL_DOCS } from "@/lib/legal";

/**
 * /llms.txt (llmstxt.org): a plain summary of the villa for AI assistants and answer engines
 * (SEO audit of 11 Nov 2026). Facts mirror the site copy (FAQ, schema); keep them in sync.
 */
export const dynamic = "force-static";

export function GET() {
  const fr = (p: string) => `${SITE_URL}/fr${p}`;
  const en = (p: string) => `${SITE_URL}/en${p}`;
  const body = `# Villa Serena Marrakech

> Exclusive-use private villa on one hectare of olive groves, at km 17 of the Ourika road (Sidi Bouzguia), about 25 minutes from Marrakech's Jemaa el-Fna square and Marrakech-Menara airport. 6 suites and an independent studio, up to 14 guests, private pool, hammam, gym, mini farm and staff on site. From 980 EUR per night incl. VAT for the whole villa.

The villa is only ever rented in full: guests are alone on the estate. The site is in French (main) and English.

## Key facts

- Location: Route de l'Ourika, km 17, Sidi Bouzguia, Marrakech, Morocco.
- Capacity: 14 guests maximum, children included.
- Accommodation: a riad with 4 suites around a patio, a pavilion with 2 suites, a lounge and a kitchen, and an independent studio.
- Outdoors: 11 x 5 m private pool (not heated), one-hectare garden, vegetable garden, mini farm, aviaries, koi carp pond, petanque, badminton, table tennis, parking inside and outside the estate.
- Wellbeing: hammam, massage room, gym.
- Included: daily breakfast, daily cleaning, bed and bath linen, pool towels, toiletries, fibre wifi, parking (inside and outside the estate).
- On request (extra charge): lunches and dinners cooked by the house cook, hammam treatments, massages, excursions, airport transfer.
- Rate: from 980 EUR per night incl. VAT for the whole villa, depending on season. Tourist tax not included (25 MAD per person per night, children under 12 exempt).
- Minimum stay: 4 nights in low and mid season, 6 nights in high season and over the year-end holidays.
- Check-in from 4 pm, check-out before 11 am.
- Booking: request on the website, answer within 24 hours; 50% deposit to confirm, balance 30 days before arrival.
- Contact: guest@villaserenamarrakech.com, +212 663 524 991 (phone and WhatsApp).
- Operator: GAUTAMA SARLAU, Morocco.

## Pages (French)

- [Accueil](${fr("")}): the villa at a glance
- [La villa](${fr("/la-villa")}): riad, patio, pavilion, studio, pool, garden, wellbeing
- [Suites](${fr("/suites")}): the 6 suites and the studio
- [Services](${fr("/services")}): what is included and on request
- [Expériences](${fr("/experiences")}): things to do around Marrakech and the Ourika valley
- [Galerie](${fr("/galerie")}): photos
- [Blog](${fr("/blog")}): guides and articles
- [Réservation](${fr("/reservation")}): rates, conditions and booking request
- [Contact](${fr("/contact")})${LEGAL_DOCS.terms.published ? `\n- [Conditions générales de vente](${fr("/conditions-generales-de-vente")})` : ""}${LEGAL_DOCS.rules.published ? `
- [Règlement intérieur](${fr("/reglement-interieur")})` : ""}

## Pages (English)

- [Home](${en("")})
- [The villa](${en("/the-villa")})
- [Suites](${en("/suites")})
- [Services](${en("/services")})
- [Experiences](${en("/experiences")})
- [Gallery](${en("/galerie")})
- [Blog](${en("/blog")})
- [Booking](${en("/reservation")})
- [Contact](${en("/contact")})${LEGAL_DOCS.terms.published ? `\n- [Terms of sale](${en("/terms-of-sale")})` : ""}${LEGAL_DOCS.rules.published ? `
- [House rules](${en("/house-rules")})` : ""}

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml)
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
