// Detailed, per-industry financing content. Each industry gets its own page
// at /industries/[slug]. `categorySlug` links to the equipment marketplace filter.

export type Industry = {
  slug: string;
  name: string;
  icon: string;
  image: string;
  headline: string;
  summary: string;
  intro: string[];
  equipment: string[];
  categorySlug: string;
};

const IMG = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

export const INDUSTRIES: Industry[] = [
  {
    slug: "construction",
    name: "Construction",
    icon: "HardHat",
    image: IMG("photo-1504307651254-35680f356dfd"),
    categorySlug: "construction",
    headline: "Construction Equipment Financing",
    summary:
      "Fast, flexible financing for excavators, loaders, cranes, and the heavy machinery that keeps your projects moving.",
    intro: [
      "From earthmoving to site prep, construction runs on equipment that's ready when the project is. We help contractors and builders across Canada acquire the machinery they need without tying up working capital — so you can take on more work and bid with confidence.",
      "Whether you're buying new from a dealer, picking up a used machine, or financing a private or auction purchase, our specialists structure terms around your project cycles and cash flow.",
    ],
    equipment: [
      "Excavators & backhoes",
      "Wheel loaders & skid steers",
      "Cranes & lifts",
      "Dozers & graders",
      "Compactors & rollers",
      "Concrete & paving equipment",
      "Attachments & implements",
      "Site & support vehicles",
    ],
  },
  {
    slug: "transportation",
    name: "Transportation",
    icon: "Truck",
    image: IMG("photo-1601584115197-04ecc0da31d7"),
    categorySlug: "transportation",
    headline: "Transportation & Trucking Equipment Financing",
    summary:
      "Financing for trucks, trailers, and fleet vehicles — built for owner-operators and national carriers alike.",
    intro: [
      "Keeping freight moving means keeping your fleet rolling. We finance everything from a single tractor to a full fleet refresh, with payment structures that match seasonal revenue and route economics.",
      "New or used, dealer or private sale, our specialists know transportation and move quickly so you don't miss the truck you want.",
    ],
    equipment: [
      "Sleeper & day-cab tractors",
      "Dry van & reefer trailers",
      "Flatbed & specialized trailers",
      "Dump & vocational trucks",
      "Delivery & cube vans",
      "Buses & passenger vehicles",
      "Tow & recovery equipment",
      "Telematics & upfit packages",
    ],
  },
  {
    slug: "manufacturing",
    name: "Industrial & Manufacturing",
    icon: "Factory",
    image: IMG("photo-1504328345606-18bbc8c9d7d1"),
    categorySlug: "manufacturing",
    headline: "Manufacturing Equipment Financing",
    summary:
      "Finance CNC machines, presses, and full production lines to expand capacity and modernize your operation.",
    intro: [
      "Upgrading a production line or adding capacity is a major investment — financing lets you put new equipment to work immediately while preserving the capital you need to run the floor.",
      "We finance individual machines and complete turnkey lines, with terms that align repayments to the productivity your new equipment delivers.",
    ],
    equipment: [
      "CNC machining centres",
      "Press brakes & shears",
      "Injection molding machines",
      "Laser & plasma cutters",
      "Robotics & automation cells",
      "Packaging & palletizing lines",
      "Material handling & conveyors",
      "Tooling & ancillary equipment",
    ],
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    icon: "Tractor",
    image: IMG("photo-1530267981375-f0de937f5f13"),
    categorySlug: "agricultural",
    headline: "Agriculture Equipment Financing",
    summary:
      "Tractors, harvesters, and farm equipment financed around your growing season and cash flow.",
    intro: [
      "Farming is seasonal, and so should your payments be. We finance new and used agricultural equipment with flexible and seasonal structures that line up with harvest and sale cycles.",
      "From a single implement to a full equipment fleet, our specialists understand the realities of the farm and fund quickly so you're ready for the field.",
    ],
    equipment: [
      "Tractors & loaders",
      "Combines & harvesters",
      "Seeders & planters",
      "Sprayers & applicators",
      "Tillage & haying equipment",
      "Grain handling & storage",
      "Livestock & dairy equipment",
      "Implements & attachments",
    ],
  },
  {
    slug: "medical",
    name: "Medical & Lab",
    icon: "Stethoscope",
    image: IMG("photo-1666214280557-f1b5022eb634"),
    categorySlug: "medical",
    headline: "Medical & Lab Equipment Financing",
    summary:
      "Imaging, diagnostic, and clinical equipment financing for practices, clinics, and laboratories.",
    intro: [
      "Modern care depends on modern equipment. We help medical practices, clinics, and labs acquire diagnostic and clinical technology without a large upfront outlay — so you can invest in patient care, not just hardware.",
      "Financing and leasing options let you stay current with evolving technology while keeping monthly costs predictable.",
    ],
    equipment: [
      "MRI, CT & imaging systems",
      "Ultrasound & X-ray equipment",
      "Laboratory & diagnostic analyzers",
      "Surgical & operatory equipment",
      "Dental & orthodontic equipment",
      "Patient monitoring systems",
      "Examination & treatment furniture",
      "Practice IT & software",
    ],
  },
  {
    slug: "aviation-marine",
    name: "Aviation & Marine",
    icon: "Plane",
    image: IMG("photo-1540962351504-03099e0a754b"),
    categorySlug: "transportation",
    headline: "Aviation & Marine Equipment Financing",
    summary:
      "Specialized financing for aircraft, vessels, and supporting equipment — including private and cross-border sales.",
    intro: [
      "Aviation and marine purchases call for specialized financing, and our team structures deals that account for higher values, registration, and cross-border transactions.",
      "Whether you're buying a business aircraft, a commercial vessel, or supporting ground and dock equipment, we move quickly so you can close on the asset you want.",
    ],
    equipment: [
      "Business & private jets",
      "Turboprop aircraft",
      "Helicopters",
      "Boats & yachts",
      "Commercial & fishing vessels",
      "Ground support equipment",
      "Hangar & dock equipment",
      "Avionics & refit packages",
    ],
  },
  {
    slug: "technology",
    name: "Office & Technology",
    icon: "Server",
    image: IMG("photo-1558494949-ef010cbdcc31"),
    categorySlug: "technology",
    headline: "Office & Technology Equipment Financing",
    summary:
      "Finance servers, networking, and IT infrastructure to modernize your business and preserve cash.",
    intro: [
      "Technology moves fast, and financing keeps you current without large capital purchases. We fund full IT refreshes and office build-outs with terms that match equipment lifecycles.",
      "From data-centre hardware to point-of-sale and office systems, our specialists help you upgrade now and pay over time.",
    ],
    equipment: [
      "Servers & storage",
      "Networking & switching",
      "Workstations & laptops",
      "Point-of-sale systems",
      "Security & surveillance",
      "Phone & conferencing systems",
      "Office furniture & fit-outs",
      "Software & licensing",
    ],
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    icon: "UtensilsCrossed",
    image: IMG("photo-1581349485608-9469926a8e5e"),
    categorySlug: "restaurant",
    headline: "Hospitality & Restaurant Equipment Financing",
    summary:
      "Commercial kitchens, refrigeration, and front-of-house equipment financed for restaurants and hotels.",
    intro: [
      "Opening, renovating, or expanding a hospitality business is capital-intensive. Financing lets you outfit your kitchen and dining room — or an entire property — while keeping cash on hand for operations.",
      "We finance complete turnkey build-outs and individual pieces, with structures that fit the rhythm of your business.",
    ],
    equipment: [
      "Ranges, ovens & fryers",
      "Walk-in & reach-in refrigeration",
      "Dishwashing & sanitation",
      "Prep & stainless stations",
      "Ventilation & hood systems",
      "Bar & beverage equipment",
      "POS & ordering systems",
      "Furniture & front-of-house",
    ],
  },
  {
    slug: "oil-mining",
    name: "Oil & Mining",
    icon: "Pickaxe",
    image: IMG("photo-1611273426858-450d8e3c9fce"),
    categorySlug: "construction",
    headline: "Oil, Gas & Mining Equipment Financing",
    summary:
      "Rugged equipment financing for resource extraction, drilling, and remote site operations.",
    intro: [
      "Resource operations demand heavy, specialized equipment built for the harshest conditions. We finance the machinery that keeps extraction, processing, and site operations running.",
      "Our specialists understand the scale and economics of the sector and structure financing for both new and used heavy equipment.",
    ],
    equipment: [
      "Drilling & well-service equipment",
      "Haul trucks & loaders",
      "Crushing & screening plants",
      "Pumps & compressors",
      "Generators & power systems",
      "Tanks & processing equipment",
      "Site & support vehicles",
      "Camp & remote-site equipment",
    ],
  },
  {
    slug: "forestry",
    name: "Forestry",
    icon: "Trees",
    image: IMG("photo-1473773508845-188df298d2d1"),
    categorySlug: "agricultural",
    headline: "Forestry & Logging Equipment Financing",
    summary:
      "Harvesters, forwarders, and processing equipment financed for the forestry sector.",
    intro: [
      "Forestry operations rely on durable, high-value machinery. We finance the harvesting and processing equipment that keeps timber moving from the bush to the mill.",
      "New or used, our specialists fund the equipment your operation depends on with flexible terms built around seasonal work.",
    ],
    equipment: [
      "Harvesters & feller bunchers",
      "Forwarders & skidders",
      "Log loaders & processors",
      "Chippers & grinders",
      "Delimbers & slashers",
      "Logging trucks & trailers",
      "Mulchers & attachments",
      "Sawmill & yard equipment",
    ],
  },
];

export function getIndustry(slug: string) {
  return INDUSTRIES.find((i) => i.slug === slug);
}
