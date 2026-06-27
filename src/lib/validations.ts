import { z } from "zod";

const phoneRegex = /^[\d\s()+.-]{7,20}$/;

export const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  company: z.string().max(160).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  equipmentNeeded: z.string().max(160).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  amount: z.coerce.number().nonnegative().optional(),
  source: z.enum(["HOMEPAGE", "LISTING", "APPLICATION", "CONTACT_PAGE"]).default("HOMEPAGE"),
  listingId: z.string().optional(),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional().or(z.literal("")),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  subject: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(5, "Please enter a message").max(2000),
  website: z.string().max(0).optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const listingSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).optional(),
  description: z.string().min(10),
  categoryId: z.string().min(1, "Select a category"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  monthlyPayment: z.coerce.number().nonnegative().optional(),
  condition: z.enum(["NEW", "USED"]),
  province: z.enum(["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"]),
  city: z.string().max(120).optional().or(z.literal("")),
  year: z.coerce.number().int().min(1950).max(2100).optional(),
  make: z.string().max(120).optional().or(z.literal("")),
  model: z.string().max(120).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "SOLD"]),
  featured: z.boolean().default(false),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
  metaDescription: z.string().max(300).optional().or(z.literal("")),
  specifications: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).optional(),
});
export type ListingInput = z.infer<typeof listingSchema>;

export const blogSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).optional(),
  excerpt: z.string().max(400).optional().or(z.literal("")),
  content: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  featured: z.boolean().default(false),
  readMinutes: z.coerce.number().int().min(1).max(60).default(5),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
  metaDescription: z.string().max(300).optional().or(z.literal("")),
  publishedAt: z.string().optional(),
});
export type BlogInput = z.infer<typeof blogSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const settingsSchema = z.object({
  companyName: z.string().min(1),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  smtpHost: z.string().optional(),
  smtpPort: z.coerce.number().int().optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.string().optional(),
  smtpFrom: z.string().optional(),
  notifyEmail: z.string().email().optional().or(z.literal("")),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
