import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/logo";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Admin Login", path: "/secure-admin/login", noIndex: true });

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-12 text-white lg:flex">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80"
            alt=""
            fill
            sizes="50vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/90 to-navy-950" />
        </div>
        <div className="relative">
          <Logo variant="light" href="/" />
        </div>
        <div className="relative">
          <span className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Admin Portal</span>
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight">
            Manage your financing platform with confidence.
          </h1>
          <p className="mt-4 max-w-md text-white/65">
            Listings, leads, blog content, and settings — all in one secure, enterprise-grade
            dashboard built for the Financing in Canada team.
          </p>
        </div>
        <p className="relative text-sm text-white/45">
          © {new Date().getFullYear()} Financing in Canada
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo href="/" />
          </div>
          <div className="mt-8 lg:mt-0">
            <h2 className="font-display text-2xl font-bold">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access the admin dashboard.
            </p>
          </div>
          <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-xl bg-secondary" />}>
            <LoginForm className="mt-8" />
          </Suspense>
          <p className="mt-6 rounded-lg bg-secondary p-3 text-center text-xs text-muted-foreground">
            Demo: <span className="font-medium text-foreground">admin@financingincanada.com</span> /{" "}
            <span className="font-medium text-foreground">Admin123!Change</span>
          </p>
        </div>
      </div>
    </div>
  );
}
