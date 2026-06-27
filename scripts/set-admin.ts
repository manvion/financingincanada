import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = "info@financingincanada.com";
const PASSWORD = "Admin123!";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: { passwordHash, role: Role.ADMIN, isActive: true, name: "Admin" },
    create: { email: EMAIL, name: "Admin", passwordHash, role: Role.ADMIN, isActive: true },
  });

  // Remove the old default seeded admin so its known credentials can't be used.
  await prisma.user.deleteMany({ where: { email: "admin@financingincanada.com" } });

  console.log(`✅ Admin set: ${user.email} (role ${user.role})`);
  console.log("   Old admin@financingincanada.com removed (if it existed).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
