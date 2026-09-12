import { NextResponse } from "next/server";
import {
  listAdminCurriculumModules,
  parseLessonLines,
  serializeCurriculumModule,
} from "../../../lib/curriculum";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const modules = await listAdminCurriculumModules();
    return NextResponse.json({ modules });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load curriculum";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      label?: string;
      title?: string;
      description?: string;
      lessons?: string;
    };

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

    const last = await prisma.curriculumModule.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const module = await prisma.curriculumModule.create({
      data: {
        label,
        title,
        description,
        sortOrder: (last?.sortOrder ?? -1) + 1,
        published: true,
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

    return NextResponse.json(
      { module: serializeCurriculumModule(module) },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create module";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
