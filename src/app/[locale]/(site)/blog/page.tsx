import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/PageIntro";
import { Link } from "@/i18n/navigation";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "blog", path: "/blog" });
}

/** Blog list: all articles in the same large format, newest order from the admin (annex M49). */
export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const isEn = locale === "en";
  const posts = await db.blogPost
    .findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);

  const date = (d: Date) =>
    new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);

  return (
    <>
      <PageIntro eyebrow={t("page_title")} title={t("h1")} lead={t("page_sub")} />

      {posts.length === 0 ? (
        <p className="pb-28 text-center font-sans text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 lg:pb-32">
          {/* M49: every article presented like the first, one under the other (applies to new articles too). */}
          <div className="space-y-20 lg:space-y-24">
            {posts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
                <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-t-[14rem] bg-muted">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={(isEn ? post.imageAltEn : post.imageAlt) || (isEn && post.titleEn ? post.titleEn : post.title)}
                      fill
                      priority={i === 0}
                      sizes="(min-width:1024px) 58vw, 100vw"
                      className="object-cover object-center transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="lg:col-span-5">
                  <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta">
                    {t(`cat_${post.category}`)} · {date(post.createdAt)} · {post.readTime} {t("min_read")}
                  </p>
                  <h2 className="mt-4 font-serif text-3xl lg:text-[2.6rem] leading-tight text-villa-ink group-hover:text-villa-terracotta transition-colors">
                    {isEn && post.titleEn ? post.titleEn : post.title}
                  </h2>
                  <p className="mt-4 font-sans text-muted-foreground leading-relaxed line-clamp-3">
                    {isEn && post.excerptEn ? post.excerptEn : post.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-villa-ink border-b border-villa-ink/30 pb-1">
                    {t("read_more")} <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
