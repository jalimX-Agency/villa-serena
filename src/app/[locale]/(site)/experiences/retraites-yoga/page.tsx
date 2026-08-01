import { setRequestLocale } from "next-intl/server";
import { PrivatisationPage } from "@/components/PrivatisationPage";

export default async function RetraitesYogaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <PrivatisationPage
      serviceType="retreat"
      titleKey="experiences.retraitesYoga.page_title"
      subKey="experiences.retraitesYoga.page_sub"
      heroImage="/exp-hammam.jpg"
      intro={
        isEn
          ? "A calm, private setting for yoga and wellness retreats — the whole villa reserved for your group, with the garden and patio for morning practice, the traditional hammam for recovery, and home-cooked meals from the kitchen garden."
          : "Un cadre calme et privé pour vos retraites de yoga et de bien-être — la villa entière réservée pour votre groupe, avec le jardin et le patio pour la pratique du matin, le hammam traditionnel pour la récupération, et une cuisine familiale préparée avec les légumes du potager."
      }
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
    />
  );
}
