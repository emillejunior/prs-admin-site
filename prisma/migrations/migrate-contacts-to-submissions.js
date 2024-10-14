const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function migrateData() {
  const contacts = await prisma.contact.findMany();

  for (const contact of contacts) {
    await prisma.submission.create({
      data: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message || "No message provided",
        subject: "Migrated Contact",
        status: "NEW",
        profession: contact.profession,
        createdAt: contact.createdAt,
        updatedAt: new Date()
      }
    });
  }

  console.log(`Migrated ${contacts.length} contacts to submissions`);
}

migrateData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
