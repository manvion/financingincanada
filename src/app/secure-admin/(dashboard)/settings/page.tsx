import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireSuperAdmin();
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });

  const canEdit = true;

  const initial = {
    companyName: settings?.companyName ?? "Financing in Canada",
    tagline: settings?.tagline ?? "",
    phone: settings?.phone ?? "",
    email: settings?.email ?? "",
    address: settings?.address ?? "",
    city: settings?.city ?? "",
    province: settings?.province ?? "",
    postalCode: settings?.postalCode ?? "",
    facebookUrl: settings?.facebookUrl ?? "",
    linkedinUrl: settings?.linkedinUrl ?? "",
    twitterUrl: settings?.twitterUrl ?? "",
    instagramUrl: settings?.instagramUrl ?? "",
    smtpHost: settings?.smtpHost ?? "",
    smtpPort: settings?.smtpPort ?? undefined,
    smtpSecure: settings?.smtpSecure ?? false,
    smtpUser: settings?.smtpUser ?? "",
    smtpFrom: settings?.smtpFrom ?? "",
    notifyEmail: settings?.notifyEmail ?? "",
  };

  return (
    <div>
      <AdminPageHeader title="Settings" description="Manage company information, social links, and email configuration." />
      <SettingsForm initial={initial} canEdit={canEdit} />
    </div>
  );
}
