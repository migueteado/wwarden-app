import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./data/categories";

const prisma = new PrismaClient();

async function main() {
  await seedCategories(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
