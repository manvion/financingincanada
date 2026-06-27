import { PrismaClient, Role, Condition, ListingStatus, Province, BlogStatus, LeadStatus, LeadSource } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Construction Equipment", slug: "construction", icon: "HardHat", description: "Excavators, loaders, cranes, and heavy machinery." },
  { name: "Transportation", slug: "transportation", icon: "Truck", description: "Trucks, trailers, and fleet vehicles." },
  { name: "Manufacturing Equipment", slug: "manufacturing", icon: "Factory", description: "CNC machines, presses, and production lines." },
  { name: "Medical Equipment", slug: "medical", icon: "Stethoscope", description: "Imaging, diagnostics, and clinical equipment." },
  { name: "Restaurant Equipment", slug: "restaurant", icon: "UtensilsCrossed", description: "Commercial kitchens, ovens, and refrigeration." },
  { name: "Agricultural Equipment", slug: "agricultural", icon: "Tractor", description: "Tractors, harvesters, and farm machinery." },
  { name: "Technology Equipment", slug: "technology", icon: "Server", description: "Servers, networking, and IT infrastructure." },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const IMG = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1200&q=80`;

async function main() {
  console.log("🌱 Seeding database…");

  // ── Admin user ────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "info@financingincanada.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: process.env.SEED_ADMIN_NAME ?? "Admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`👤 Admin: ${admin.email} / ${adminPassword}`);

  // ── Settings ──────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      companyName: "Financing in Canada",
      tagline: "Helping Canadian Businesses Finance Their Growth",
      phone: "1-888-555-0142",
      email: "info@financingincanada.com",
      address: "150 King Street West, Suite 2300",
      city: "Toronto",
      province: "ON",
      postalCode: "M5H 1J9",
      notifyEmail: process.env.ADMIN_EMAIL ?? adminEmail,
      linkedinUrl: "https://linkedin.com/company/financing-in-canada",
      facebookUrl: "https://facebook.com/financingincanada",
      businessHours: {
        weekdays: "8:00 AM – 5:00 PM PST",
        saturday: "8:00 AM – 5:00 PM PST",
        sunday: "8:00 AM – 5:00 PM PST",
      },
    },
  });

  // ── Categories ────────────────────────────────────────────
  const categoryMap = new Map<string, string>();
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon, description: c.description, order: i },
      create: { ...c, order: i },
    });
    categoryMap.set(c.slug, cat.id);
  }

  // ── Listings ──────────────────────────────────────────────
  const listings = [
    {
      title: "2021 Caterpillar 320 Hydraulic Excavator",
      cat: "construction",
      price: 285000,
      monthly: 4980,
      condition: Condition.USED,
      province: Province.ON,
      city: "Mississauga",
      year: 2021,
      make: "Caterpillar",
      model: "320",
      featured: true,
      img: "photo-1581094794329-c8112a89af12",
      desc: "Low-hour Cat 320 next-gen excavator with advanced hydraulics, integrated grade control, and a fully enclosed climate cab. Meticulously maintained and inspection-ready.",
      specs: [
        { label: "Operating Weight", value: "22,200 kg" },
        { label: "Engine Power", value: "122 kW (164 hp)" },
        { label: "Max Dig Depth", value: "6.7 m" },
        { label: "Hours", value: "2,140" },
      ],
    },
    {
      title: "2022 Freightliner Cascadia Sleeper Tractor",
      cat: "transportation",
      price: 162000,
      monthly: 2890,
      condition: Condition.USED,
      province: Province.AB,
      city: "Calgary",
      year: 2022,
      make: "Freightliner",
      model: "Cascadia",
      featured: true,
      img: "photo-1601584115197-04ecc0da31d7",
      desc: "Fuel-efficient Cascadia with the Detroit DD15 powertrain, 72-inch raised-roof sleeper, and full ADAS safety suite. Ideal for long-haul fleets.",
      specs: [
        { label: "Engine", value: "Detroit DD15" },
        { label: "Transmission", value: "DT12 Automated" },
        { label: "Mileage", value: "318,000 km" },
        { label: "Sleeper", value: "72\" Raised Roof" },
      ],
    },
    {
      title: "Haas VF-2 CNC Vertical Machining Center",
      cat: "manufacturing",
      price: 94500,
      monthly: 1720,
      condition: Condition.USED,
      province: Province.QC,
      city: "Laval",
      year: 2020,
      make: "Haas",
      model: "VF-2",
      featured: true,
      img: "photo-1565043666747-69f6646db940",
      desc: "Versatile 3-axis vertical machining center with a 30-tool carousel, high-speed spindle, and through-spindle coolant. Perfect for precision job shops.",
      specs: [
        { label: "Travels (XYZ)", value: "762 × 406 × 508 mm" },
        { label: "Spindle Speed", value: "8,100 RPM" },
        { label: "Tool Capacity", value: "30" },
        { label: "Control", value: "Haas Next-Gen" },
      ],
    },
    {
      title: "GE Optima MR450w 1.5T MRI System",
      cat: "medical",
      price: 410000,
      monthly: 7150,
      condition: Condition.USED,
      province: Province.BC,
      city: "Vancouver",
      year: 2019,
      make: "GE Healthcare",
      model: "Optima MR450w",
      featured: false,
      img: "photo-1516069677018-378515003435",
      desc: "Wide-bore 1.5T MRI delivering exceptional image quality with a comfortable 70 cm bore. Includes coils, chiller, and OEM-certified de-install support.",
      specs: [
        { label: "Field Strength", value: "1.5 Tesla" },
        { label: "Bore", value: "70 cm" },
        { label: "Gradient", value: "44 mT/m" },
        { label: "Coils", value: "Full set included" },
      ],
    },
    {
      title: "Commercial Kitchen Package — Restaurant Build-Out",
      cat: "restaurant",
      price: 78000,
      monthly: 1490,
      condition: Condition.NEW,
      province: Province.ON,
      city: "Ottawa",
      year: 2024,
      make: "Mixed",
      model: "Turnkey Package",
      featured: true,
      img: "photo-1556910103-1c02745aae4d",
      desc: "Complete turnkey commercial kitchen: six-burner ranges, convection ovens, walk-in refrigeration, stainless prep stations, and ventilation. Financing covers full build-out.",
      specs: [
        { label: "Ranges", value: "2 × 6-burner" },
        { label: "Refrigeration", value: "Walk-in cooler + freezer" },
        { label: "Ventilation", value: "16 ft Type-1 hood" },
        { label: "Warranty", value: "Manufacturer new" },
      ],
    },
    {
      title: "2023 John Deere 6155M Utility Tractor",
      cat: "agricultural",
      price: 198000,
      monthly: 3460,
      condition: Condition.NEW,
      province: Province.SK,
      city: "Regina",
      year: 2023,
      make: "John Deere",
      model: "6155M",
      featured: false,
      img: "photo-1605338803155-8b46c2b3a1d8",
      desc: "Powerful 155 hp utility tractor with CommandQuad transmission, premium cab, and front loader compatibility. Built for mixed-farm productivity.",
      specs: [
        { label: "Engine Power", value: "155 hp" },
        { label: "Transmission", value: "CommandQuad Plus" },
        { label: "PTO", value: "540/1000" },
        { label: "Hours", value: "85 (demo)" },
      ],
    },
    {
      title: "Dell PowerEdge Data Center Refresh (Rack)",
      cat: "technology",
      price: 142000,
      monthly: 2380,
      condition: Condition.NEW,
      province: Province.ON,
      city: "Toronto",
      year: 2024,
      make: "Dell",
      model: "PowerEdge R760",
      featured: false,
      img: "photo-1558494949-ef010cbdcc31",
      desc: "Full 42U rack of PowerEdge R760 servers with redundant power, top-of-rack switching, and 3-year ProSupport. Lease the whole stack and preserve working capital.",
      specs: [
        { label: "Servers", value: "8 × R760" },
        { label: "Total Cores", value: "768" },
        { label: "Networking", value: "Dual 25GbE ToR" },
        { label: "Support", value: "3-yr ProSupport Plus" },
      ],
    },
    {
      title: "2020 Bobcat S770 Skid-Steer Loader",
      cat: "construction",
      price: 64500,
      monthly: 1180,
      condition: Condition.USED,
      province: Province.MB,
      city: "Winnipeg",
      year: 2020,
      make: "Bobcat",
      model: "S770",
      featured: false,
      img: "photo-1599057332724-0c9b1b8c5e8a",
      desc: "High-flow S770 skid-steer with enclosed cab, 2-speed travel, and quick-attach plate. Includes bucket and pallet forks.",
      specs: [
        { label: "Rated Capacity", value: "1,560 kg" },
        { label: "Engine", value: "92 hp Turbo" },
        { label: "Hours", value: "1,890" },
        { label: "Attachments", value: "Bucket + forks" },
      ],
    },
  ];

  for (const l of listings) {
    const slug = slugify(l.title);
    const created = await prisma.listing.upsert({
      where: { slug },
      update: {},
      create: {
        title: l.title,
        slug,
        description: l.desc,
        specifications: l.specs,
        price: l.price,
        monthlyPayment: l.monthly,
        condition: l.condition,
        province: l.province,
        city: l.city,
        year: l.year,
        make: l.make,
        model: l.model,
        status: ListingStatus.PUBLISHED,
        featured: l.featured,
        views: Math.floor(Math.random() * 800) + 50,
        categoryId: categoryMap.get(l.cat)!,
        authorId: admin.id,
        publishedAt: new Date(),
        metaTitle: `${l.title} | Financing in Canada`,
        metaDescription: l.desc.slice(0, 155),
      },
    });
    const existingImg = await prisma.listingImage.findFirst({ where: { listingId: created.id } });
    if (!existingImg) {
      await prisma.listingImage.createMany({
        data: [
          { listingId: created.id, url: IMG(l.img), alt: l.title, order: 0 },
          { listingId: created.id, url: IMG("photo-1504917595217-d4dc5ebe6122"), alt: `${l.title} detail`, order: 1 },
        ],
      });
    }
  }

  // ── Blog posts ────────────────────────────────────────────
  const blogs = [
    {
      title: "Equipment Financing vs. Leasing: Which Is Right for Your Business?",
      category: "Equipment Financing",
      img: "photo-1454165804606-c3d57bc86b40",
      excerpt: "Understanding the tax, cash-flow, and ownership trade-offs between financing and leasing your next piece of equipment.",
      tags: ["financing", "leasing", "cash flow"],
      featured: true,
    },
    {
      title: "5 Ways Smart Financing Accelerates Business Growth",
      category: "Business Growth",
      img: "photo-1556761175-5973dc0f32e7",
      excerpt: "Preserve working capital, scale faster, and seize opportunities — here's how the right financing partner changes the game.",
      tags: ["growth", "strategy"],
      featured: false,
    },
    {
      title: "How to Get Approved for Equipment Financing — Fast",
      category: "Leasing Tips",
      img: "photo-1450101499163-c8848c66ca85",
      excerpt: "A practical checklist of documents, credit factors, and insider tips to speed your approval from days to hours.",
      tags: ["approval", "credit", "tips"],
      featured: false,
    },
    {
      title: "2026 Outlook: Equipment Costs and Financing Rates in Canada",
      category: "Industry News",
      img: "photo-1521791136064-7986c2920216",
      excerpt: "What rising rates, supply normalization, and new tax incentives mean for Canadian businesses buying equipment this year.",
      tags: ["industry", "rates", "canada"],
      featured: false,
    },
  ];

  for (const b of blogs) {
    const slug = slugify(b.title);
    await prisma.blog.upsert({
      where: { slug },
      update: {},
      create: {
        title: b.title,
        slug,
        excerpt: b.excerpt,
        content: blogBody(b.title, b.excerpt),
        coverImage: IMG(b.img),
        category: b.category,
        tags: b.tags,
        status: BlogStatus.PUBLISHED,
        featured: b.featured,
        readMinutes: 6,
        authorId: admin.id,
        publishedAt: new Date(),
        metaTitle: `${b.title} | Financing in Canada Blog`,
        metaDescription: b.excerpt.slice(0, 155),
      },
    });
  }

  // ── Testimonials ──────────────────────────────────────────
  const testimonials = [
    { name: "Marc Tremblay", company: "Tremblay Construction", role: "Owner", rating: 5, quote: "Financing in Canada approved our excavator in under 24 hours. The rate beat our bank and the process was effortless.", order: 0 },
    { name: "Priya Sharma", company: "NorthStar Logistics", role: "Fleet Director", rating: 5, quote: "We financed eight tractors through their team. Flexible terms and a specialist who actually understood transportation.", order: 1 },
    { name: "David Chen", company: "Maple Leaf Manufacturing", role: "CFO", rating: 5, quote: "Preserving working capital while upgrading our CNC line was critical. They structured a lease that fit our cash flow perfectly.", order: 2 },
  ];
  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!exists) await prisma.testimonial.create({ data: t });
  }

  // ── Sample leads & contacts ───────────────────────────────
  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    await prisma.lead.createMany({
      data: [
        { name: "Jennifer Walsh", company: "Walsh Excavating", email: "jen@walshexc.ca", phone: "613-555-0188", equipmentNeeded: "Excavator", message: "Looking to finance a mid-size excavator within 30 days.", status: LeadStatus.NEW, source: LeadSource.HOMEPAGE },
        { name: "Omar Haddad", company: "Cedar Transport", email: "omar@cedartransport.ca", phone: "905-555-0102", equipmentNeeded: "Trucks", message: "Need 3 sleeper tractors. What rates can you offer?", status: LeadStatus.CONTACTED, source: LeadSource.LISTING },
        { name: "Sophie Gagnon", company: "Bistro Lumière", email: "sophie@bistrolumiere.ca", phone: "514-555-0144", equipmentNeeded: "Restaurant Equipment", message: "Full kitchen build-out for a new location.", status: LeadStatus.NEW, source: LeadSource.APPLICATION },
      ],
    });
  }
  const contactCount = await prisma.contactSubmission.count();
  if (contactCount === 0) {
    await prisma.contactSubmission.create({
      data: { name: "Alex Morgan", email: "alex@morganfarms.ca", phone: "306-555-0170", subject: "Agricultural financing question", message: "Do you finance used combines from private sellers?", source: LeadSource.CONTACT_PAGE },
    });
  }

  console.log("✅ Seed complete.");
}

function blogBody(title: string, excerpt: string): string {
  return `## Introduction

${excerpt}

For Canadian businesses, the decision around how to acquire equipment is one of the most consequential financial choices you'll make. The right structure preserves cash, optimizes taxes, and positions you for growth.

## Why It Matters

When you finance equipment instead of paying cash, you keep working capital available for payroll, inventory, and unexpected opportunities. Spreading the cost over the equipment's productive life also aligns expenses with the revenue the asset generates.

### Key Considerations

- **Cash flow:** Predictable monthly payments make budgeting straightforward.
- **Tax treatment:** Interest and depreciation (or lease payments) may be deductible — consult your accountant.
- **Ownership:** Financing builds equity; leasing maximizes flexibility.
- **Approval speed:** A specialized lender approves faster than a traditional bank.

## How Financing in Canada Helps

Our financing specialists work with businesses of every size, from owner-operators to national fleets. We shop competitive rates across our lender network, structure flexible terms around your cash flow, and move from application to approval in as little as 24 hours.

> "The right financing partner doesn't just fund equipment — they fund momentum."

## Next Steps

Ready to explore your options? [Apply now](/apply) or browse our [current equipment listings](/equipment). Our team will reach out with a tailored quote — no obligation.`;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
