import { setRequestLocale } from "next-intl/server";
import { PrivatisationPage } from "@/components/PrivatisationPage";

export default async function MariagesEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <PrivatisationPage
      serviceType="privatisation"
      titleKey="experiences.mariagesEvents.page_title"
      subKey="experiences.mariagesEvents.page_sub"
      heroImage="/exp-excursions.jpg"
      intro={
        isEn
          ? "Villa Serena is yours alone for the day, or for several — the whole property, garden, pool and dining room set aside for your wedding, seminar or celebration. A private venue for up to 14 overnight guests, with day-guest capacity for a larger event."
          : "Villa Serena est à vous seul le temps d'une journée, ou de plusieurs — toute la propriété, le jardin, la piscine et la salle à manger réservés pour votre mariage, séminaire ou célébration. Un lieu privé jusqu'à 14 couchages, avec une capacité d'accueil plus large pour les invités à la journée."
      }
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
    />
  );
}
