import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { media } from "@/lib/media";
import { SITE_URL } from "@/lib/seo";
import { withToc } from "@/lib/blog";
import { Link } from "@/i18n/navigation";
import { StarDivider } from "@/components/StarDivider";

export const revalidate = 300;

async function getPost(slug: string) {
  return db.blogPost.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const isEn = locale === "en";
  const title = (isEn ? post.metaTitleEn : post.metaTitle) || `${isEn && post.titleEn ? post.titleEn : post.title} | Villa Serena`;
  const description = (isEn ? post.metaDescriptionEn : post.metaDescription) || (isEn ? post.excerptEn : post.excerpt).slice(0, 158);
  const url = `${SITE_URL}/${locale}/blog/${slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { fr: `${SITE_URL}/fr/blog/${slug}`, en: `${SITE_URL}/en/blog/${slug}`, "x-default": `${SITE_URL}/fr/blog/${slug}` },
    },
    openGraph: { type: "article", title, description, url, images: [{ url: post.image || media("/hero-main.jpg") }] },
  };
}

/** Article template (client brief ch. 11): title, photo, reading time, contents, booking box. */
export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPost(slug);
  if (!post) notFound();

  const t = await getTranslations();
  const isEn = locale === "en";
  const title = isEn && post.titleEn ? post.titleEn : post.title;
  const excerpt = isEn && post.excerptEn ? post.excerptEn : post.excerpt;
  const { html, toc } = withToc(isEn && post.contentEn ? post.contentEn : post.content);
  const alt = (isEn ? post.imageAltEn : post.imageAlt) || title;
  const date = new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(post.createdAt);
  const ctaBody = t.has(`blog.cta_body.${slug}`) ? t(`blog.cta_body.${slug}`) : t("blog.cta_body.default");

  const related = await db.blogPost.findMany({
    where: { published: true, slug: { not: slug } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 2,
  });

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: post.image ? [post.image] : undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: locale,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Villa Serena Marrakech", logo: { "@type": "ImageObject", url: media("/logo-serena-color.png") } },
    mainEntityOfPage: `${SITE_URL}/${locale}/blog/${slug}`,
  });
  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("nav.home"), item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("nav.blog"), item: `${SITE_URL}/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}/${locale}/blog/${slug}` },
    ],
  });

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />

      <header className="pt-32 lg:pt-44 pb-10 px-6 lg:px-8 mx-auto max-w-4xl text-center">
        <Link href="/blog" className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-villa-terracotta">
          ← {t("blog.back")}
        </Link>
        <p className="mt-6 font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta">
          {t(`blog.cat_${post.category}`)} · {post.readTime} {t("blog.min_read")}
        </p>
        <h1 className="mt-4 font-serif font-light text-[clamp(2.2rem,5vw,3.9rem)] leading-[1.05] text-villa-ink text-balance">{title}</h1>
        <p className="mt-5 font-sans text-sm text-muted-foreground">
          {t("blog.by")} {post.author} · <time dateTime={post.createdAt.toISOString()}>{date}</time>
        </p>
      </header>

      {post.image && (
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="relative aspect-[16/8] overflow-hidden rounded-t-[16rem] bg-muted">
            <Image src={post.image} alt={alt} fill priority sizes="(min-width:1280px) 1152px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-14 lg:py-20 grid gap-12 lg:grid-cols-12">
        {/* Contents */}
        {toc.length > 1 && (
          <nav aria-label={t("blog.toc")} className="lg:col-span-3 lg:order-2">
            <div className="lg:sticky lg:top-32 border-t-2 border-villa-terracotta-light pt-4">
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-ink mb-3">{t("blog.toc")}</p>
              <ol className="space-y-2">
                {toc.map((h, i) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="flex gap-2 font-sans text-sm text-muted-foreground hover:text-villa-terracotta">
                      <span className="tabular-nums text-villa-terracotta">{String(i + 1).padStart(2, "0")}</span>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        <div className="lg:col-span-8 lg:col-start-1 lg:order-1">
          <p className="font-serif text-xl lg:text-2xl leading-relaxed text-villa-ink">{excerpt}</p>
          <StarDivider className="my-10 max-w-[12rem]" tone="terracotta" />
          {/* Trusted HTML authored by the villa (seed script / admin). */}
          <div className="prose-villa" dangerouslySetInnerHTML={{ __html: html }} />

          {/* « Séjourner à Villa Serena » box (client brief charter). */}
          <aside className="relative mt-14 overflow-hidden bg-villa-ink text-white p-8 lg:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-14 -bottom-24 h-72 w-48 rounded-t-full border border-white/10" />
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold">{t("blog.cta_title")}</p>
            <p className="mt-3 font-serif text-2xl lg:text-3xl leading-snug text-white max-w-xl">{ctaBody}</p>
            <Link
              href="/reservation"
              className="mt-7 inline-flex px-7 py-3.5 bg-villa-terracotta hover:brightness-110 text-white font-sans text-xs tracking-[0.15em] uppercase transition"
            >
              {t("nav.book")}
            </Link>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-villa-sand border-t border-border py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-villa-ink mb-8">{t("blog.related")}</h2>
            <div className="grid gap-10 sm:grid-cols-2">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group grid grid-cols-[8rem_1fr] gap-5 items-center">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {p.image && <Image src={p.image} alt="" fill sizes="128px" className="object-cover" />}
                  </div>
                  <div>
                    <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-villa-terracotta">{t(`blog.cat_${p.category}`)}</p>
                    <h3 className="mt-1 font-serif text-xl leading-snug text-villa-ink group-hover:text-villa-terracotta">
                      {isEn && p.titleEn ? p.titleEn : p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
