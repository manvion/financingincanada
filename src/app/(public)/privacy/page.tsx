import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Privacy Policy", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description="How we collect, use, and protect your information." />
      <section className="py-16">
        <div className="container-wide prose-fic max-w-3xl">
          <p>
            Financing in Canada (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what
            information we collect through our website and how we use it.
          </p>
          <h2>Information We Collect</h2>
          <p>
            When you submit an application, inquiry, or contact form, we collect the details you
            provide — such as your name, company, email, phone number, and the equipment you are
            interested in financing.
          </p>
          <h2>How We Use It</h2>
          <ul>
            <li>To respond to your financing inquiries and provide quotes.</li>
            <li>To connect you with the appropriate financing specialist.</li>
            <li>To improve our services and communicate relevant updates.</li>
          </ul>
          <h2>Data Protection</h2>
          <p>
            Your information is stored securely and is never sold. We share it only with lending
            partners necessary to fulfill your financing request, and only with your consent.
          </p>
          <h2>Contact</h2>
          <p>
            For privacy questions, email{" "}
            <a href="mailto:privacy@financingincanada.com">privacy@financingincanada.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
