import { prisma } from "./prisma";

export type AdminFaq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
};

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
};

export function serializeFaq(item: FaqRow): AdminFaq {
  return {
    id: item.id,
    question: item.question,
    answer: item.answer,
    sortOrder: item.sortOrder,
    published: item.published,
  };
}

export async function listAdminFaqs() {
  const items = await prisma.$queryRaw<FaqRow[]>`
    SELECT id, question, answer, "sortOrder", published
    FROM faqs
    ORDER BY "sortOrder" ASC, "createdAt" ASC
  `;

  return items.map(serializeFaq);
}

export async function listPublishedFaqs() {
  const items = await prisma.$queryRaw<FaqRow[]>`
    SELECT id, question, answer, "sortOrder", published
    FROM faqs
    WHERE published = true
    ORDER BY "sortOrder" ASC, "createdAt" ASC
  `;

  return items.map(serializeFaq);
}

export async function findFaqById(id: string) {
  const items = await prisma.$queryRaw<FaqRow[]>`
    SELECT id, question, answer, "sortOrder", published
    FROM faqs
    WHERE id = ${id}
    LIMIT 1
  `;

  return items[0] ? serializeFaq(items[0]) : null;
}

export async function nextFaqSortOrder() {
  const rows = await prisma.$queryRaw<{ max: number | null }[]>`
    SELECT MAX("sortOrder") AS max FROM faqs
  `;

  return (rows[0]?.max ?? -1) + 1;
}

export async function createFaq(data: {
  question: string;
  answer: string;
  sortOrder: number;
}) {
  const id = `faq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  await prisma.$executeRaw`
    INSERT INTO faqs
      (id, question, answer, "sortOrder", published, "createdAt", "updatedAt")
    VALUES
      (${id}, ${data.question}, ${data.answer}, ${data.sortOrder}, true, NOW(), NOW())
  `;

  const created = await findFaqById(id);
  if (!created) {
    throw new Error("Unable to create FAQ");
  }

  return created;
}

export async function updateFaq(
  id: string,
  data: { question: string; answer: string },
) {
  await prisma.$executeRaw`
    UPDATE faqs
    SET
      question = ${data.question},
      answer = ${data.answer},
      "updatedAt" = NOW()
    WHERE id = ${id}
  `;

  const updated = await findFaqById(id);
  if (!updated) {
    throw new Error("Unable to update FAQ");
  }

  return updated;
}

export async function deleteFaq(id: string) {
  await prisma.$executeRaw`
    DELETE FROM faqs WHERE id = ${id}
  `;
}
