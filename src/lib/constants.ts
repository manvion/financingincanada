export const SITE = {
  name: "Financing in Canada",
  shortName: "FIC",
  tagline: "The Best Way to Finance Equipment in Canada",
  description:
    "Apply with Financing in Canada and get a fast loan decision within 24 hours. 100% financing, terms from 12 to 84 months, and the lowest payments in Canada.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "info@financingincanada.com",
  locale: "en_CA",
};

export const HERO = {
  headline: "The Best Way to Finance Equipment in Canada",
  subheadline:
    "Time is money in your line of business — so why wait? Apply with Financing in Canada and get a fast loan decision within 24 hours.",
};

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/equipment", label: "Equipment" },
  { href: "/vendors", label: "Vendors" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export const BUSINESS_HOURS = {
  weekdays: "Mon – Fri · 8:00 AM – 5:00 PM PST",
  saturday: "Sat · 8:00 AM – 5:00 PM PST",
  sunday: "Sun · 8:00 AM – 5:00 PM PST",
};

export const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

export const WHY_CHOOSE_US = [
  {
    icon: "BadgeCheck",
    title: "High Approval Ratio",
    description: "91% of submitted applications are approved. Strong lender relationships mean more businesses get a yes.",
  },
  {
    icon: "Percent",
    title: "Lowest Payments in Canada",
    description: "We shop Canada's leading banks, financial institutions, and private lenders to secure your lowest possible payment.",
  },
  {
    icon: "Zap",
    title: "24-Hour Decisions",
    description: "Apply online in under five minutes and receive a credit decision within 24 hours — no branch runaround.",
  },
  {
    icon: "Landmark",
    title: "100% Financing",
    description: "Finance the full cost of your equipment with no down payment required, preserving your working capital.",
  },
  {
    icon: "SlidersHorizontal",
    title: "Flexible Terms",
    description: "Terms from 12 to 84 months, structured around your cash flow with seasonal and deferred payment options.",
  },
  {
    icon: "UserCheck",
    title: "Dedicated Specialists",
    description: "A single leasing specialist explains every term clearly and guides you from application to funding.",
  },
];

export const HOW_IT_WORKS = [
  { step: 1, icon: "FileText", title: "Apply Online", description: "Complete a simple online application in under five minutes — no lengthy paperwork upfront." },
  { step: 2, icon: "Search", title: "Application Review", description: "Our leasing specialists review your application and match it to the right lender in our network." },
  { step: 3, icon: "BadgeCheck", title: "Get Approved", description: "Receive a credit decision within 24 hours, with clear terms explained by your dedicated specialist." },
  { step: 4, icon: "TrendingUp", title: "Get Funded", description: "We pay your vendor directly. Put your equipment to work and start growing right away." },
];

export const STATS = [
  { value: 91, suffix: "%", label: "Applications Approved" },
  { value: 24, suffix: "h", label: "Loan Decision Turnaround" },
  { value: 100, suffix: "%", label: "Financing Available" },
  { value: 84, prefix: "", suffix: "mo", label: "Terms Up To" },
];

// Industry data (with detailed per-industry content) lives in src/lib/industries.ts

export const SERVICE_AREA = {
  note: "100% online — proudly serving businesses across Canada.",
  coverage: ["Canada-Wide", "Every Province", "Every Territory", "100% Online"],
};

// Service data (with detailed per-service content) lives in src/lib/services.ts

export const BLOG_CATEGORIES = [
  "Equipment Financing",
  "Business Growth",
  "Leasing Tips",
  "Industry News",
];

export const LENDERS = [
  "Royal Bank",
  "TD Equipment Finance",
  "BMO Capital",
  "Scotiabank",
  "CIBC",
  "National Bank",
  "Desjardins",
  "EQ Financial",
  "Canadian Western",
  "ATB Financial",
];

export const FAQS = [
  {
    q: "How fast can I get approved for equipment financing?",
    a: "Most applications receive a credit decision within 24 hours. Our online application takes under five minutes, and a dedicated specialist reviews it the same business day.",
  },
  {
    q: "What credit score do I need to qualify?",
    a: "There's no single cutoff. We work with Canada's leading banks and private lenders, which lets us approve a wide range of credit profiles — including newer businesses. We approve 91% of submitted applications.",
  },
  {
    q: "Do I need a down payment?",
    a: "Often no. We offer up to 100% financing on qualifying equipment, so you can preserve your working capital and put the equipment to work right away.",
  },
  {
    q: "What terms and amounts are available?",
    a: "Financing terms range from 12 to 84 months. We finance equipment of nearly any value, from a single asset to a full fleet or facility build-out.",
  },
  {
    q: "Can I finance used or private-sale equipment?",
    a: "Yes. We finance new and used equipment, including private-party and auction purchases. We'll even pre-approve you before you bid so you can buy with confidence.",
  },
  {
    q: "Will applying affect my credit score?",
    a: "No. Getting a quote and starting an application does not involve a hard credit pull, so there's no impact on your score to explore your options.",
  },
];

export const PRICE_RANGES = [
  { label: "Any Price", value: "any" },
  { label: "Under $50,000", value: "0-50000" },
  { label: "$50,000 – $100,000", value: "50000-100000" },
  { label: "$100,000 – $250,000", value: "100000-250000" },
  { label: "$250,000+", value: "250000-99999999" },
];
