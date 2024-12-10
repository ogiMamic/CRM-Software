import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const inventoryItems = [
    {
      name: "Painting - Landscape",
      type: "Painting",
      quantity: 5,
      status: "Available",
    },
    {
      name: "Rosary",
      type: "Religious Item",
      quantity: 2,
      status: "Low Stock",
    },
    {
      name: "Bible",
      type: "Book",
      quantity: 0,
      status: "Out of Stock",
    },
    {
      name: "Sculpture - Abstract",
      type: "Sculpture",
      quantity: 3,
      status: "Available",
    },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: item,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
