import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Terms of Service", path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" description="The terms governing your use of our website." />
      <section className="py-16">
        <div className="container-wide prose-fic max-w-3xl">
          <p>
            By accessing and using the Financing in Canada website, you agree to the following terms.
          </p>
          <h2>Use of the Website</h2>
          <p>
            This website provides information about equipment financing services. Submitting an
            application or inquiry does not constitute an offer or guarantee of financing.
          </p>
          <h2>Financing Approvals</h2>
          <p>
            All financing is subject to credit approval, lender criteria, and applicable terms. Rates
            and monthly payment estimates shown are illustrative and may vary based on your profile.
          </p>
          <h2>Listings</h2>
          <p>
            Equipment listings are provided for informational purposes. Availability, pricing, and
            specifications are subject to change without notice.
          </p>
          <h2>Limitation of Liability</h2>
          <p>
            We are not liable for any indirect or consequential damages arising from use of this
            website. Content is provided &quot;as is&quot; without warranties of any kind.
          </p>
        </div>
      </section>
    </>
  );
}
