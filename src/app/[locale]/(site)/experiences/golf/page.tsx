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
    title: t("golf.page_title"),
    description: t("golf.page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/experiences/golf`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/experiences/golf",
        en: "https://www.villaserenamarrakech.com/en/experiences/golf",
      },
    },
  };
}

export default async function GolfPage({
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
      serviceType="golf"
      titleKey="experiences.golf.page_title"
      subKey="experiences.golf.page_sub"
      hero={{ type: "brand" }}
      intro={
        isEn
          ? "Villa Serena sits close to Marrakech's golf courses, making it a relaxed private base for a golf stay — start early with breakfast on request, and unwind afterwards in the traditional hammam or by the pool. Tell us your plans and we'll help arrange transfers."
          : "Villa Serena se trouve à proximité des parcours de golf de Marrakech, ce qui en fait une base privée et reposante pour un séjour golf — petit-déjeuner matinal sur demande, puis détente au retour dans le hammam traditionnel ou au bord de la piscine. Dites-nous vos plans, nous vous aidons à organiser les transferts."
      }
      highlights={
        isEn
          ? [
              "Close to Marrakech's golf courses",
              "Early breakfast available on request",
              "Traditional hammam and massage room to unwind",
              "Transfers arranged on request",
            ]
          : [
              "À proximité des parcours de golf de Marrakech",
              "Petit-déjeuner matinal disponible sur demande",
              "Hammam traditionnel et salle de massage pour se détendre",
              "Transferts organisés sur demande",
            ]
      }
      facts={
        isEn
          ? [
              { label: "Location", value: "Close to Marrakech's courses" },
              { label: "Mornings", value: "Early breakfast on request" },
              { label: "Recovery", value: "Hammam & massage on-site" },
              { label: "Transfers", value: "Arranged on request" },
            ]
          : [
              { label: "Emplacement", value: "Proche des parcours de Marrakech" },
              { label: "Matinées", value: "Petit-déjeuner matinal sur demande" },
              { label: "Récupération", value: "Hammam & massage sur place" },
              { label: "Transferts", value: "Organisés sur demande" },
            ]
      }
      related={[
        {
          label: t("mariagesEvents.page_title"),
          sub: t("mariagesEvents.page_sub"),
          href: "/experiences/mariages-events",
          image: "/exp-excursions.jpg",
        },
        {
          label: t("retraitesYoga.page_title"),
          sub: t("retraitesYoga.page_sub"),
          href: "/experiences/retraites-yoga",
          image: "/exp-hammam.jpg",
        },
      ]}
    />
  );
}
