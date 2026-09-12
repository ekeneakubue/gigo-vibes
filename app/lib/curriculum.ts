import { prisma } from "./prisma";

export type AdminCurriculumModule = {
  id: string;
  label: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
  lessons: string[];
};

export function serializeCurriculumModule(module: {
  id: string;
  label: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
  lessons: { title: string; sortOrder: number }[];
}): AdminCurriculumModule {
  return {
    id: module.id,
    label: module.label,
    title: module.title,
    description: module.description,
    sortOrder: module.sortOrder,
    published: module.published,
    lessons: [...module.lessons]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((lesson) => lesson.title),
  };
}

export async function listAdminCurriculumModules() {
  const modules = await prisma.curriculumModule.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      lessons: {
        select: { title: true, sortOrder: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return modules.map(serializeCurriculumModule);
}

export async function listPublishedCurriculumModules() {
  const modules = await prisma.curriculumModule.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      lessons: {
        select: { title: true, sortOrder: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return modules.map(serializeCurriculumModule);
}

export function parseLessonLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
