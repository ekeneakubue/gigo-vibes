import { NextResponse } from "next/server";
import {
  parseLessonLines,
  serializeCurriculumModule,
} from "../../../../lib/curriculum";
import { prisma } from "../../../../lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      label?: string;
      title?: string;
      description?: string;
      lessons?: string;
    };

    const existing = await prisma.curriculumModule.findUnique({
      where: { id },
      select: { id: true, sortOrder: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Module not found." }, { status: 404 });
    }

    const label = body.label?.trim() ?? "";
    const title = body.title?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const lessons = parseLessonLines(body.lessons ?? "");

    if (!label || !title || !description) {
      return NextResponse.json(
        { error: "Label, title, and description are required." },
        { status: 400 },
      );
    }
    if (lessons.length === 0) {
      return NextResponse.json(
        { error: "Add at least one lesson." },
        { status: 400 },
      );
    }

    const module = await prisma.$transaction(async (tx) => {
      await tx.lesson.deleteMany({ where: { moduleId: id } });

      return tx.curriculumModule.update({
        where: { id },
        data: {
          label,
          title,
          description,
          lessons: {
            create: lessons.map((lessonTitle, index) => ({
              title: lessonTitle,
              sortOrder: index,
            })),
          },
        },
        include: {
          lessons: {
            select: { title: true, sortOrder: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      });
    });

    return NextResponse.json({ module: serializeCurriculumModule(module) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update module";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing module id." }, { status: 400 });
    }

    const existing = await prisma.curriculumModule.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Module not found." }, { status: 404 });
    }

    await prisma.curriculumModule.delete({
      where: { id },
      select: { id: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete module";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
