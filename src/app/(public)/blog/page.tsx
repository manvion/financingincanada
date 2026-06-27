import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { BlogFilters } from "@/components/site/blog-filters";
import { Pagination } from "@/components/site/pagination";
import { Badge } from "@/components/ui/badge";
import { getFeaturedBlog, getPublishedBlogs } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Equipment financing guides, leasing tips, business growth strategies, and industry news for Canadian businesses.",
  path: "/blog",
});

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = str(params.category);
  const q = str(params.q);
  const page = Math.max(1, Number(str(params.page) ?? "1") || 1);

  const [featured, result] = await Promise.all([
    !category && !q && page === 1 ? getFeaturedBlog() : Promise.resolve(null),
    getPublishedBlogs({ category, q, page, perPage: 9 }),
  ]);

  const posts = featured ? result.blogs.filter((b) => b.id !== featured.id) : result.blogs;

  return (
    <>
      <PageHero
        eyebrow="Insights & Resources"
        title="The Financing in Canada Blog"
        description="Practical guides and expert analysis to help Canadian businesses make smarter equipment decisions."
        breadcrumb={[{ label: "Blog" }]}
        image="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <BlogFilters />

          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative mt-10 block overflow-hidden rounded-3xl border-l-4 border-gold bg-navy-gradient p-8 text-white shadow-card transition-all hover:shadow-premium lg:p-12"
            >
              <Badge variant="gold" className="mb-4">Featured</Badge>
              <span className="ml-3 text-xs font-semibold uppercase tracking-wider text-gold">
                {featured.category}
              </span>
              <h2 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-tight text-white group-hover:text-gold-200 lg:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-2xl text-white/75 line-clamp-3">{featured.excerpt}</p>
              <p className="mt-5 text-sm text-white/55">
                {featured.author?.name ?? "Editorial Team"} · {formatDate(featured.publishedAt)} ·{" "}
                {featured.readMinutes} min read
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-medium text-gold">
                Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )}

          {posts.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
              <Newspaper className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-xl font-semibold">No articles found</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try a different category or search term.</p>
            </div>
          ) : (
            <>
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="card-premium group flex h-full flex-col rounded-2xl border border-l-4 border-l-gold/40 bg-card p-7 shadow-card hover:border-l-gold"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                      {blog.category}
                    </span>
                    <h3 className="mt-3 line-clamp-3 font-display text-xl font-semibold text-foreground group-hover:text-primary">
                      {blog.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{blog.excerpt}</p>
                    <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">
                      {formatDate(blog.publishedAt)} · {blog.readMinutes} min read
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                      Read article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                basePath="/blog"
                query={{ category, q }}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
