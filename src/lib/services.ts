// Detailed, per-service content. Each service has its own page at /services/[slug].

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  image: string;
  headline: string;
  summary: string;
  intro: string[];
  features: { title: string; description: string }[];
  bestFor: string[];
};

const IMG = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

export const SERVICES: Service[] = [
  {
    slug: "equipment-leasing",
    title: "Equipment Leasing",
    shortTitle: "Equipment Leasing",
    icon: "FileSignature",
    image: IMG("photo-1454165804606-c3d57bc86b40"),
    headline: "Equipment Leasing",
    summary:
      "Lease-to-own and fair-market-value leasing that lets you acquire equipment while preserving working capital.",
    intro: [
      "Leasing is the most flexible way to put equipment to work without a large upfront purchase. You make predictable monthly payments over a fixed term, and at the end you can buy the equipment, renew, or return it — whichever suits your business.",
      "We structure both lease-to-own ($10 buyout) and fair-market-value leases, with terms from 12 to 84 months tailored to your cash flow and the productive life of the asset.",
    ],
    features: [
      { title: "Low monthly payments", description: "Deferring the residual lowers your monthly cost versus a straight purchase." },
      { title: "100% financing", description: "Acquire equipment with little to no money down and keep your capital working." },
      { title: "Flexible end-of-term options", description: "Buy it out, upgrade, renew, or return at the end of the lease." },
      { title: "Potential tax advantages", description: "Lease payments may be treated as an operating expense — ask your accountant." },
    ],
    bestFor: [
      "Businesses that want the lowest monthly payment",
      "Equipment that may be upgraded at term end",
      "Preserving cash and credit lines",
    ],
  },
  {
    slug: "sale-leaseback",
    title: "Sale & Leaseback",
    shortTitle: "Sale & Leaseback",
    icon: "Repeat",
    image: IMG("photo-1450101499163-c8848c66ca85"),
    headline: "Sale & Leaseback Financing",
    summary:
      "Turn equipment you already own into immediate working capital, then lease it back on terms that work for you.",
    intro: [
      "A sale-leaseback unlocks the equity in equipment you already own. We purchase the asset from you — putting cash in your hands — and lease it right back, so you keep using the equipment without interruption.",
      "It's a fast, flexible way to generate working capital for payroll, growth, inventory, or to consolidate higher-cost debt, while keeping the tools your business runs on.",
    ],
    features: [
      { title: "Fast access to capital", description: "Convert owned equipment into cash, often within days." },
      { title: "Keep using your equipment", description: "Nothing leaves your shop — you lease back the same asset." },
      { title: "Improve cash flow", description: "Free up capital tied to depreciating assets and redeploy it." },
      { title: "Debt consolidation", description: "Use the proceeds to pay down higher-interest obligations." },
    ],
    bestFor: [
      "Businesses cash-rich in equipment but tight on cash",
      "Funding growth without new bank debt",
      "Consolidating expensive debt",
    ],
  },
  {
    slug: "used-equipment-financing",
    title: "Used Equipment & Private Sales",
    shortTitle: "Used & Private Sales",
    icon: "Handshake",
    image: IMG("photo-1581094794329-c8112a89af12"),
    headline: "Used Equipment & Private-Sale Financing",
    summary:
      "Financing for used equipment from any source — dealer, private seller, or auction — with expert guidance throughout.",
    intro: [
      "Some of the best equipment value is in the used market, but many lenders shy away from private sales. We don't. We finance quality used equipment whether you're buying from a dealer, a private party, or an auction.",
      "Our specialists guide you through valuation, documentation, and payment so a private-sale purchase is as smooth as buying new.",
    ],
    features: [
      { title: "Private-seller purchases", description: "We handle the paperwork and pay the seller directly." },
      { title: "Dealer & auction buys", description: "Financing for used inventory from any reputable source." },
      { title: "Fair valuation support", description: "Guidance to make sure you're paying a fair market price." },
      { title: "Fast funding", description: "Move quickly so you don't lose the machine to another buyer." },
    ],
    bestFor: [
      "Buyers sourcing value in the used market",
      "Private-party and estate purchases",
      "Auction and liquidation buys",
    ],
  },
  {
    slug: "pre-approvals",
    title: "Pre-Approvals & Auctions",
    shortTitle: "Pre-Approvals & Auctions",
    icon: "Gavel",
    image: IMG("photo-1556761175-5973dc0f32e7"),
    headline: "Pre-Approvals & Auction Financing",
    summary:
      "Get pre-approved before you shop or bid, so you can buy with confidence and close fast.",
    intro: [
      "Knowing your budget before you shop changes everything. A pre-approval tells you exactly how much you can spend, so you can negotiate from strength and move the moment you find the right machine.",
      "It's especially valuable at auction, where deals close fast and financing has to be ready. We pre-approve you up to a set amount so you can bid with confidence.",
    ],
    features: [
      { title: "Know your budget upfront", description: "Shop and negotiate with a firm number in hand." },
      { title: "Bid with confidence", description: "Pre-approval up to a set limit so you're ready at auction." },
      { title: "Close quickly", description: "Funding is lined up before you commit, so deals don't fall through." },
      { title: "No obligation", description: "A pre-approval costs nothing and doesn't commit you to buy." },
    ],
    bestFor: [
      "Auction and liquidation buyers",
      "Shoppers who want negotiating leverage",
      "Time-sensitive purchases",
    ],
  },
  {
    slug: "cross-border-financing",
    title: "Cross-Border Financing",
    shortTitle: "Cross-Border",
    icon: "Globe",
    image: IMG("photo-1521791136064-7986c2920216"),
    headline: "Cross-Border Equipment Financing",
    summary:
      "Financing for equipment purchased across the Canada–U.S. border, with support for the added complexity.",
    intro: [
      "The best equipment isn't always for sale at home. When the right machine is south of the border, we finance cross-border purchases and help navigate the currency, logistics, and documentation involved.",
      "Our specialists coordinate the details so an international purchase is as straightforward as buying domestically.",
    ],
    features: [
      { title: "Canada–U.S. purchases", description: "Finance equipment sourced from American dealers and sellers." },
      { title: "Currency & payment handling", description: "Guidance on cross-border payment and exchange." },
      { title: "Documentation support", description: "Help with the added paperwork of an international buy." },
      { title: "Specialist coordination", description: "One point of contact to keep the deal moving." },
    ],
    bestFor: [
      "Buyers sourcing equipment from the U.S.",
      "Specialized or hard-to-find machines",
      "Better pricing across the border",
    ],
  },
  {
    slug: "small-business-loans",
    title: "Small Business Loans",
    shortTitle: "Small Business Loans",
    icon: "Banknote",
    image: IMG("photo-1554224155-6726b3ff858f"),
    headline: "Small Business Loans",
    summary:
      "Working-capital loans for Canadian businesses — funded in as little as 24 hours.",
    intro: [
      "Sometimes you need capital, not just equipment. Our small business loans give you flexible working capital for whatever your business needs — inventory, payroll, expansion, or bridging a gap.",
      "With a simple online application and decisions in as little as 24 hours, you get funded fast without the lengthy process of a traditional bank loan.",
    ],
    features: [
      { title: "Fast funding", description: "Receive working capital in as little as 24 hours." },
      { title: "Flexible use of funds", description: "Use the capital wherever your business needs it most." },
      { title: "Simple application", description: "Apply online in minutes with minimal paperwork." },
      { title: "Built for SMBs", description: "Designed for the realities of small and growing businesses." },
    ],
    bestFor: [
      "Bridging short-term cash-flow gaps",
      "Funding inventory or payroll",
      "Growth and expansion projects",
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
