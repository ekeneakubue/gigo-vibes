import { PrismaClient, UserStatus } from "@prisma/client";
import { courseModules, demoUsers, faqItems } from "../app/lib/content";

const prisma = new PrismaClient();

async function main() {
  for (const [index, module] of courseModules.entries()) {
    await prisma.curriculumModule.upsert({
      where: { id: `seed_module_${index + 1}` },
      update: {
        label: module.week,
        title: module.title,
        description: module.description,
        sortOrder: index,
        published: true,
        lessons: {
          deleteMany: {},
          create: module.lessons.map((title, lessonIndex) => ({
            title,
            sortOrder: lessonIndex,
          })),
        },
      },
      create: {
        id: `seed_module_${index + 1}`,
        label: module.week,
        title: module.title,
        description: module.description,
        sortOrder: index,
        published: true,
        lessons: {
          create: module.lessons.map((title, lessonIndex) => ({
            title,
            sortOrder: lessonIndex,
          })),
        },
      },
    });
  }

  for (const [index, faq] of faqItems.entries()) {
    await prisma.faq.upsert({
      where: { id: `seed_faq_${index + 1}` },
      update: {
        question: faq.question,
        answer: faq.answer,
        sortOrder: index,
        published: true,
      },
      create: {
        id: `seed_faq_${index + 1}`,
        question: faq.question,
        answer: faq.answer,
        sortOrder: index,
        published: true,
      },
    });
  }

  const statusMap = {
    active: UserStatus.ACTIVE,
    pending: UserStatus.PENDING,
    refunded: UserStatus.REFUNDED,
  } as const;

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: "ChangeMe123!",
        status: statusMap[user.status],
        paidAt: new Date(user.paidAt),
        channel: user.channel === "—" ? null : user.channel,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: "ChangeMe123!",
        status: statusMap[user.status],
        paidAt: new Date(user.paidAt),
        channel: user.channel === "—" ? null : user.channel,
      },
    });
  }
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
