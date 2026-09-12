import { NextResponse } from "next/server";
import {
  deleteTechStackItem,
  deriveTechMark,
  findTechStackItemById,
  updateTechStackItem,
} from "../../../../lib/tech-stack";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      name?: string;
      logo?: string;
      layer?: string;
      purpose?: string;
    };

    const existing = await findTechStackItemById(id);
    if (!existing) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const name = body.name?.trim() ?? "";
    const layer = body.layer?.trim() ?? "";
    const purpose = body.purpose?.trim() ?? "";
    const logo = (body.logo?.trim() || existing.logo).trim();
    const mark = deriveTechMark(name);

    if (!name || !layer || !purpose) {
      return NextResponse.json(
        { error: "Name, layer, and purpose are required." },
        { status: 400 },
      );
    }
    if (!logo) {
      return NextResponse.json(
        { error: "Upload a logo for this technology." },
        { status: 400 },
      );
    }

    const item = await updateTechStackItem(id, {
      name,
      mark,
      logo,
      layer,
      purpose,
    });

    return NextResponse.json({ item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update tech stack item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing item id." }, { status: 400 });
    }

    const existing = await findTechStackItemById(id);
    if (!existing) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    await deleteTechStackItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete tech stack item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
