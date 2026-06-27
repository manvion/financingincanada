import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HOURS = "8:00 AM – 5:00 PM PST";

async function main() {
  const updated = await prisma.settings.update({
    where: { id: "singleton" },
    data: {
      businessHours: { weekdays: HOURS, saturday: HOURS, sunday: HOURS },
    },
  });

  console.log("✅ Business hours updated:", updated.businessHours);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
