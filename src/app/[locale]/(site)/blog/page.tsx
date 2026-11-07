import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { PageIntro } from "@/components/PageIntro";
import { Link } from "@/i18n/navigation";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "blog", path: "/blog" });
}

/** Blog list, grouped by category (client brief ch. 11). */
export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const isEn = locale === "en";
  const posts = await db.blogPost
    .findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);

  const [lead, ...rest] = posts;
  const date = (d: Date) =>
    new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);

  return (
    <>
      <PageIntro eyebrow={t("page_title")} title={t("h1")} lead={t("page_sub")} />

      {posts.length === 0 ? (
        <p className="pb-28 text-center font-sans text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 lg:pb-32">
          {/* Lead article */}
          <Link href={`/blog/${lead.slug}`} className="group grid gap-8 lg:grid-cols-12 lg:gap-12 items-center mb-20">
            <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-t-[14rem] bg-muted">
              {lead.image && (
                <Image
                  src={lead.image}
                  alt={(isEn ? lead.imageAltEn : lead.imageAlt) || ""}
                  fill
                  sizes="(min-width:1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                />
              )}
            </div>
            <div className="lg:col-span-5">
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta">
                {t(`cat_${lead.category}`)} · {lead.readTime} {t("min_read")}
              </p>
              <h2 className="mt-4 font-serif text-3xl lg:text-[2.6rem] leading-tight text-villa-ink group-hover:text-villa-terracotta transition-colors text-balance">
                {isEn && lead.titleEn ? lead.titleEn : lead.title}
              </h2>
              <p className="mt-4 font-sans text-muted-foreground leading-relaxed line-clamp-4">
                {isEn && lead.excerptEn ? lead.excerptEn : lead.excerpt}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-villa-ink border-b border-villa-ink/30 pb-1">
                {t("read_more")} <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </Link>

          {/* Other articles, by category */}
          {BLOG_CATEGORIES.map((cat) => {
            const list = rest.filter((p) => p.category === cat);
            if (list.length === 0) return null;
            return (
              <section key={cat} className="mb-16">
                <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta border-b border-border pb-3 mb-8">
                  {t(`cat_${cat}`)}
                </h2>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {p.image && (
                          <Image
                            src={p.image}
                            alt={(isEn ? p.imageAltEn : p.imageAlt) || ""}
                            fill
                            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                          />
                        )}
                      </div>
                      <p className="mt-4 font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                        {date(p.createdAt)} · {p.readTime} {t("min_read")}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl leading-snug text-villa-ink group-hover:text-villa-terracotta transition-colors">
                        {isEn && p.titleEn ? p.titleEn : p.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
