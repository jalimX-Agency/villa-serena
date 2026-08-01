import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrivatisationPage } from "@/components/PrivatisationPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experiences" });
  return {
    title: t("mariagesEvents.page_title"),
    description: t("mariagesEvents.page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/experiences/mariages-events`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/experiences/mariages-events",
        en: "https://www.villaserenamarrakech.com/en/experiences/mariages-events",
      },
    },
    openGraph: { images: [{ url: "https://www.villaserenamarrakech.com/exp-excursions.jpg" }] },
  };
}

export default async function MariagesEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const t = await getTranslations({ locale, namespace: "experiences" });

  return (
    <PrivatisationPage
      serviceType="privatisation"
      titleKey="experiences.mariagesEvents.page_title"
      subKey="experiences.mariagesEvents.page_sub"
      hero={{ type: "photo", src: "/exp-excursions.jpg" }}
      intro={
        isEn
          ? "Villa Serena is yours alone for the day, or for several — the whole property, garden, pool and dining room set aside for your wedding, seminar or celebration. A private venue for up to 14 overnight guests, with day-guest capacity for a larger event."
          : "Villa Serena est à vous seul le temps d'une journée, ou de plusieurs — toute la propriété, le jardin, la piscine et la salle à manger réservés pour votre mariage, séminaire ou célébration. Un lieu privé jusqu'à 14 couchages, avec une capacité d'accueil plus large pour les invités à la journée."
      }
      highlights={
        isEn
          ? [
              "Exclusive use of the whole villa, garden and pool",
              "Dining room seating up to 14 guests",
              "Shaded garden lounge, ideal for a reception",
              "Hammam and massage room available for guests",
            ]
          : [
              "Villa, jardin et piscine en exclusivité",
              "Salle à manger pouvant accueillir 14 convives",
              "Salon extérieur ombragé, idéal pour une réception",
              "Hammam et salle de massage à disposition des invités",
            ]
      }
      gallery={["/welcome-jardin.jpg", "/welcome-salon.jpg"]}
      facts={
        isEn
          ? [
              { label: "Capacity", value: "Up to 14 guests (overnight)" },
              { label: "Dining room", value: "Seats up to 14" },
              { label: "Grounds", value: "Garden, pool, terraces" },
              { label: "Catering", value: "Home cooking, on request" },
            ]
          : [
              { label: "Capacité", value: "Jusqu'à 14 couchages" },
              { label: "Salle à manger", value: "Jusqu'à 14 convives" },
              { label: "Extérieurs", value: "Jardin, piscine, terrasses" },
              { label: "Restauration", value: "Cuisine familiale, sur demande" },
            ]
      }
      related={[
        {
          label: t("retraitesYoga.page_title"),
          sub: t("retraitesYoga.page_sub"),
          href: "/experiences/retraites-yoga",
          image: "/exp-hammam.jpg",
        },
        {
          label: t("golf.page_title"),
          sub: t("golf.page_sub"),
          href: "/experiences/golf",
        },
      ]}
    />
  );
}
