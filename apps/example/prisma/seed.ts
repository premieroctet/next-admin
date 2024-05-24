import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Science",
  "Technology",
  "Engineering",
  "Mathematics",
  "Arts",
  "Humanities",
];

async function main() {
  for (const i of Array.from(Array(25).keys())) {
    await prisma.user.upsert({
      where: { email: `user${i}@nextadmin.io` },
      update: {},
      create: {
        email: `user${i}@nextadmin.io`,
        name: `User ${i}`,
        ...(i === 0 ? { role: "ADMIN" } : {}),
      },
    });
  }

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category,
      },
    });
  }
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
