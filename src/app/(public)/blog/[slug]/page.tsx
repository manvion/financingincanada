import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ArrowLeft, CalendarDays, Clock, Tag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/site/share-buttons";
import { Separator } from "@/components/ui/separator";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/queries";
import { renderMarkdown } from "@/lib/markdown";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return buildMetadata({ title: "Article Not Found", noIndex: true });
  return buildMetadata({
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt || blog.title,
    path: `/blog/${blog.slug}`,
    image: blog.coverImage ?? undefined,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const related = await getRelatedBlogs(blog.category, blog.id, 3);
  const html = renderMarkdown(blog.content);
  const url = `${SITE.url}/blog/${blog.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: { "@type": "Organization", name: blog.author?.name ?? SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: url,
  };

  return (
    <article className="pb-20">
      {/* Header */}
      <header className="relative overflow-hidden bg-navy-gradient pb-16 pt-14 text-white">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="container-wide relative max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <Badge variant="gold" className="mt-6">{blog.category}</Badge>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
            {blog.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gold text-navy text-xs">
                  {(blog.author?.name ?? "FC").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {blog.author?.name ?? "Editorial Team"}
            </span>
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDate(blog.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{blog.readMinutes} min read</span>
          </div>
        </div>
      </header>

      <div className="container-wide max-w-3xl">
        <div className="prose-fic mt-12" dangerouslySetInnerHTML={{ __html: html }} />

        {blog.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {blog.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Separator className="my-8" />
        <ShareButtons url={url} title={blog.title} />
      </div>

      {related.length > 0 && (
        <div className="container-wide mt-20">
          <h2 className="font-display text-2xl font-bold">Related Articles</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="card-premium group flex flex-col rounded-2xl border border-l-4 border-l-gold/40 bg-card p-6 shadow-card hover:border-l-gold"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">{r.category}</span>
                <h3 className="mt-2 line-clamp-3 font-display text-base font-semibold group-hover:text-primary">{r.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Script id="blog-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
