import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { QuoteForm } from "@/components/QuoteForm";

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
    openGraph: { images: [{ url: "/hero-main.jpg" }] },
  };
}

type FeaturedCourse = {
  name: string;
  time: string;
  holes: string;
  par: string;
  detail: string;
  architect: string;
  year: string;
  description: string;
};

type CourseRow = {
  name: string;
  holes: string;
  par: string;
  architect: string;
  time: string;
};

export default async function GolfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experiences" });
  const tRoot = await getTranslations();

  const stats = [
    { value: t("golf.stats.center"), label: t("golf.stats.center_label") },
    { value: t("golf.stats.airport"), label: t("golf.stats.airport_label") },
    { value: t("golf.stats.nearest"), label: t("golf.stats.nearest_label") },
    { value: t("golf.stats.count"), label: t("golf.stats.count_label") },
  ];
  const featured = t.raw("golf.featured") as FeaturedCourse[];
  const courses = t.raw("golf.courses") as CourseRow[];
  const tableHeaders = {
    course: t("golf.table_headers.course"),
    holes: t("golf.table_headers.holes"),
    par: t("golf.table_headers.par"),
    architect: t("golf.table_headers.architect"),
    time: t("golf.table_headers.time"),
  };

  return (
    <>
      <div className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <Image src="/hero-main.jpg" alt={t("golf.page_title")} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-villa-ink/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/80 mb-4">
            Villa Serena · Villa Exclusive
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">{t("golf.page_title")}</h1>
          <p className="font-sans text-white/85 max-w-xl">{t("golf.page_sub")}</p>
        </div>
      </div>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="font-sans text-foreground/80 leading-relaxed mb-12">{t("golf.intro")}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {stats.map((s) => (
              <div key={s.label} className="border border-border py-6 px-3">
                <p className="font-serif text-2xl text-villa-terracotta mb-1">{s.value}</p>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-villa-cream py-16 lg:py-20 border-t border-border">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <SectionLabel>{t("golf.featured_label")}</SectionLabel>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-10">{t("golf.featured_title")}</h2>
          <div className="space-y-5">
            {featured.map((course, i) => (
              <div key={course.name} className="bg-card border border-border p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl text-villa-terracotta/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-foreground">{course.name}</h3>
                  </div>
                  <span className="font-sans text-[11px] tracking-wide uppercase bg-villa-olive text-white px-3 py-1.5 whitespace-nowrap">
                    {course.time}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 mb-4 font-sans text-sm text-foreground/70">
                  <span>{course.holes}</span>
                  <span>{course.par}</span>
                  <span>{course.detail}</span>
                  <span className="text-foreground">
                    {course.architect} <span className="text-muted-foreground">· {course.year}</span>
                  </span>
                </div>
                <p className="font-sans text-sm text-foreground/70 leading-relaxed">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionLabel>{t("golf.table_label")}</SectionLabel>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">{t("golf.table_title")}</h2>
          <p className="font-sans text-sm text-foreground/70 leading-relaxed mb-8 max-w-3xl">{t("golf.table_note")}</p>

          <div className="overflow-x-auto border border-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-villa-ink text-white">
                  <th className="font-sans text-xs tracking-wide uppercase font-medium px-4 py-3">
                    {tableHeaders.course}
                  </th>
                  <th className="font-sans text-xs tracking-wide uppercase font-medium px-4 py-3">
                    {tableHeaders.holes}
                  </th>
                  <th className="font-sans text-xs tracking-wide uppercase font-medium px-4 py-3">
                    {tableHeaders.par}
                  </th>
                  <th className="font-sans text-xs tracking-wide uppercase font-medium px-4 py-3">
                    {tableHeaders.architect}
                  </th>
                  <th className="font-sans text-xs tracking-wide uppercase font-medium px-4 py-3 whitespace-nowrap">
                    {tableHeaders.time}
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={c.name} className={i % 2 === 1 ? "bg-villa-cream" : "bg-card"}>
                    <td className="font-serif text-base text-foreground px-4 py-3 whitespace-nowrap">{c.name}</td>
                    <td className="font-sans text-sm text-foreground/70 px-4 py-3">{c.holes}</td>
                    <td className="font-sans text-sm text-foreground/70 px-4 py-3">{c.par}</td>
                    <td className="font-sans text-sm text-foreground/70 px-4 py-3">{c.architect}</td>
                    <td className="font-sans text-sm text-villa-terracotta px-4 py-3 whitespace-nowrap">{c.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section className="bg-villa-cream py-16 lg:py-20 border-t border-border">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <SectionLabel>{tRoot("experiences.quote_button")}</SectionLabel>
          <QuoteForm serviceType="golf" />
        </div>
      </Section>

      <Section className="py-16 lg:py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-8 text-center">
            {tRoot("experiences.page_title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Link href="/experiences/mariages-events" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden mb-3">
                <Image
                  src="/exp-excursions.jpg"
                  alt={tRoot("experiences.mariagesEvents.page_title")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-lg text-foreground group-hover:text-villa-terracotta transition-colors">
                {tRoot("experiences.mariagesEvents.page_title")}
              </h3>
              <p className="font-sans text-xs text-muted-foreground">{tRoot("experiences.mariagesEvents.page_sub")}</p>
            </Link>
            <Link href="/experiences/retraites-yoga" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden mb-3">
                <Image
                  src="/exp-hammam.jpg"
                  alt={tRoot("experiences.retraitesYoga.page_title")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-lg text-foreground group-hover:text-villa-terracotta transition-colors">
                {tRoot("experiences.retraitesYoga.page_title")}
              </h3>
              <p className="font-sans text-xs text-muted-foreground">{tRoot("experiences.retraitesYoga.page_sub")}</p>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
