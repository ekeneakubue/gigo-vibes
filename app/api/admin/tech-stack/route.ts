import { NextResponse } from "next/server";
import {
  createTechStackItem,
  deriveTechMark,
  listAdminTechStackItems,
  nextTechStackSortOrder,
} from "../../../lib/tech-stack";

export async function GET() {
  try {
    const items = await listAdminTechStackItems();
    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load tech stack";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      logo?: string;
      layer?: string;
      purpose?: string;
    };

    const name = body.name?.trim() ?? "";
    const layer = body.layer?.trim() ?? "";
    const purpose = body.purpose?.trim() ?? "";
    const logo = body.logo?.trim() ?? "";
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

    const item = await createTechStackItem({
      name,
      mark,
      logo,
      layer,
      purpose,
      sortOrder: await nextTechStackSortOrder(),
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create tech stack item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
