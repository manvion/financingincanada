import { PrismaClient, BlogStatus } from "@prisma/client";

const prisma = new PrismaClient();

const slug = "keep-on-truckin-trucking-industry-backbone";

const content = `Every product on a store shelf, every piece of construction equipment on a job site, and every shipment delivered to a business has one thing in common—it likely spent time on a truck.

The trucking industry is the invisible engine that keeps the economy moving. Without professional drivers and reliable transportation companies, supply chains would come to a standstill within days.

## The Road to Opportunity

For many entrepreneurs, trucking offers one of the best paths to building wealth. Starting with a single truck can grow into a fleet, creating jobs and generating long-term income. With demand for freight transportation continuing across Canada and the United States, the opportunities remain strong for motivated operators.

## Technology Is Changing the Industry

Modern trucking is more advanced than ever. GPS tracking, electronic logging devices, fuel optimization software, and predictive maintenance systems help fleets operate more efficiently while reducing costs and improving safety.

Companies that embrace technology are positioning themselves for long-term success in an increasingly competitive market.

## Equipment Matters

Whether you're hauling gravel with a dump truck, transporting machinery on a lowbed, or moving freight across provinces, having dependable equipment is essential. Downtime costs money, making maintenance and smart financing decisions critical for business growth.

Investing in the right truck today can create opportunities for bigger contracts tomorrow.

## The Drivers Who Keep Canada Moving

Professional truck drivers spend countless hours away from home to ensure businesses receive the products they need. Their dedication supports industries ranging from agriculture and construction to manufacturing and retail.

They deserve recognition for the essential role they play in keeping communities supplied and economies thriving.

## Looking Ahead

As infrastructure projects expand and commerce continues to grow, the demand for trucking services will remain strong. Businesses that invest in quality equipment, skilled drivers, and efficient operations will be well positioned for the future.

The next time you see a truck rolling down the highway, remember that it's carrying more than cargo—it's carrying the economy forward.

Keep on truckin'. The road ahead is full of opportunity for those willing to drive it.`;

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });

  // Make this the single featured headline article.
  await prisma.blog.updateMany({ data: { featured: false } });

  const post = await prisma.blog.upsert({
    where: { slug },
    update: {
      title: "Keep On Truckin': Why the Trucking Industry Is the Backbone of North America",
      excerpt:
        "The trucking industry is the invisible engine that keeps the economy moving. Here's why it's full of opportunity — and why dependable equipment and smart financing keep operators rolling.",
      content,
      coverImage: null,
      category: "Industry News",
      tags: ["trucking", "transportation", "equipment", "business growth"],
      status: BlogStatus.PUBLISHED,
      featured: true,
      readMinutes: 5,
      publishedAt: new Date(),
    },
    create: {
      title: "Keep On Truckin': Why the Trucking Industry Is the Backbone of North America",
      slug,
      excerpt:
        "The trucking industry is the invisible engine that keeps the economy moving. Here's why it's full of opportunity — and why dependable equipment and smart financing keep operators rolling.",
      content,
      coverImage: null,
      category: "Industry News",
      tags: ["trucking", "transportation", "equipment", "business growth"],
      status: BlogStatus.PUBLISHED,
      featured: true,
      readMinutes: 5,
      authorId: admin?.id ?? null,
      publishedAt: new Date(),
    },
  });

  console.log(`✅ Upserted blog post: ${post.title} (/blog/${post.slug})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
