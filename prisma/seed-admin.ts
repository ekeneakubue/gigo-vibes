import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("ChangeMe123!", 10);

  await prisma.$executeRaw`
    INSERT INTO admins (id, name, email, "passwordHash", "createdAt", "updatedAt")
    VALUES (
      ${"seed_admin_1"},
      ${"GigoPlanet Admin"},
      ${"admin@gigoplanet.com"},
      ${passwordHash},
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      "passwordHash" = EXCLUDED."passwordHash",
      "updatedAt" = NOW()
  `;

  console.log("Admin seeded: admin@gigoplanet.com");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
