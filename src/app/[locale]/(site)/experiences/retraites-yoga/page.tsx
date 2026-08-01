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
    title: t("retraitesYoga.page_title"),
    description: t("retraitesYoga.page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/experiences/retraites-yoga`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/experiences/retraites-yoga",
        en: "https://www.villaserenamarrakech.com/en/experiences/retraites-yoga",
      },
    },
    openGraph: { images: [{ url: "https://www.villaserenamarrakech.com/exp-hammam.jpg" }] },
  };
}

export default async function RetraitesYogaPage({
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
      serviceType="retreat"
      titleKey="experiences.retraitesYoga.page_title"
      subKey="experiences.retraitesYoga.page_sub"
      hero={{ type: "photo", src: "/exp-hammam.jpg" }}
      intro={
        isEn
          ? "A calm, private setting for yoga and wellness retreats — the whole villa reserved for your group, with the garden and patio for morning practice, the traditional hammam for recovery, and home-cooked meals from the kitchen garden."
          : "Un cadre calme et privé pour vos retraites de yoga et de bien-être — la villa entière réservée pour votre groupe, avec le jardin et le patio pour la pratique du matin, le hammam traditionnel pour la récupération, et une cuisine familiale préparée avec les légumes du potager."
      }
      highlights={
        isEn
          ? [
              "Whole villa reserved for your group, up to 14",
              "Garden and shaded patio for morning practice",
              "Traditional hammam and massage room for recovery",
              "Home cooking from the kitchen garden, on request",
            ]
          : [
              "Villa entière réservée pour votre groupe, jusqu'à 14",
              "Jardin et patio ombragé pour la pratique du matin",
              "Hammam traditionnel et salle de massage pour la récupération",
              "Cuisine familiale du potager, sur demande",
            ]
      }
      gallery={["/exp-massage.jpg", "/exp-fitness.jpg"]}
      facts={
        isEn
          ? [
              { label: "Capacity", value: "Up to 14 participants" },
              { label: "Practice space", value: "Garden & patio" },
              { label: "Wellness", value: "Traditional hammam, massage" },
              { label: "Meals", value: "Home cooking, kitchen garden" },
            ]
          : [
              { label: "Capacité", value: "Jusqu'à 14 participants" },
              { label: "Espace de pratique", value: "Jardin & patio" },
              { label: "Bien-être", value: "Hammam traditionnel, massage" },
              { label: "Repas", value: "Cuisine familiale, potager" },
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
          label: t("golf.page_title"),
          sub: t("golf.page_sub"),
          href: "/experiences/golf",
        },
      ]}
    />
  );
}
