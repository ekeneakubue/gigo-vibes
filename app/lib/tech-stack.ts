import { prisma } from "./prisma";

export type AdminTechStackItem = {
  id: string;
  name: string;
  mark: string;
  logo: string;
  layer: string;
  purpose: string;
  sortOrder: number;
  published: boolean;
};

type TechStackRow = {
  id: string;
  name: string;
  mark: string;
  logo: string | null;
  layer: string;
  purpose: string;
  sortOrder: number;
  published: boolean;
};

export function serializeTechStackItem(
  item: TechStackRow,
): AdminTechStackItem {
  return {
    id: item.id,
    name: item.name,
    mark: item.mark,
    logo: item.logo ?? "",
    layer: item.layer,
    purpose: item.purpose,
    sortOrder: item.sortOrder,
    published: item.published,
  };
}

export async function listAdminTechStackItems() {
  const items = await prisma.$queryRaw<TechStackRow[]>`
    SELECT id, name, mark, logo, layer, purpose, "sortOrder", published
    FROM tech_stack_items
    ORDER BY "sortOrder" ASC, "createdAt" ASC
  `;

  return items.map(serializeTechStackItem);
}

export async function listPublishedTechStackItems() {
  const items = await prisma.$queryRaw<TechStackRow[]>`
    SELECT id, name, mark, logo, layer, purpose, "sortOrder", published
    FROM tech_stack_items
    WHERE published = true
    ORDER BY "sortOrder" ASC, "createdAt" ASC
  `;

  return items.map(serializeTechStackItem);
}

export async function findTechStackItemById(id: string) {
  const items = await prisma.$queryRaw<TechStackRow[]>`
    SELECT id, name, mark, logo, layer, purpose, "sortOrder", published
    FROM tech_stack_items
    WHERE id = ${id}
    LIMIT 1
  `;

  return items[0] ? serializeTechStackItem(items[0]) : null;
}

export async function createTechStackItem(data: {
  name: string;
  mark: string;
  logo: string;
  layer: string;
  purpose: string;
  sortOrder: number;
}) {
  const id = `tech_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  await prisma.$executeRaw`
    INSERT INTO tech_stack_items
      (id, name, mark, logo, layer, purpose, "sortOrder", published, "createdAt", "updatedAt")
    VALUES
      (${id}, ${data.name}, ${data.mark}, ${data.logo}, ${data.layer}, ${data.purpose}, ${data.sortOrder}, true, NOW(), NOW())
  `;

  const created = await findTechStackItemById(id);
  if (!created) {
    throw new Error("Unable to create tech stack item");
  }

  return created;
}

export async function updateTechStackItem(
  id: string,
  data: {
    name: string;
    mark: string;
    logo: string;
    layer: string;
    purpose: string;
  },
) {
  await prisma.$executeRaw`
    UPDATE tech_stack_items
    SET
      name = ${data.name},
      mark = ${data.mark},
      logo = ${data.logo},
      layer = ${data.layer},
      purpose = ${data.purpose},
      "updatedAt" = NOW()
    WHERE id = ${id}
  `;

  const updated = await findTechStackItemById(id);
  if (!updated) {
    throw new Error("Unable to update tech stack item");
  }

  return updated;
}

export async function deleteTechStackItem(id: string) {
  await prisma.$executeRaw`
    DELETE FROM tech_stack_items WHERE id = ${id}
  `;
}

export async function nextTechStackSortOrder() {
  const rows = await prisma.$queryRaw<{ max: number | null }[]>`
    SELECT MAX("sortOrder") AS max FROM tech_stack_items
  `;

  return (rows[0]?.max ?? -1) + 1;
}

export function deriveTechMark(name: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
  if (!cleaned) return "TS";

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
