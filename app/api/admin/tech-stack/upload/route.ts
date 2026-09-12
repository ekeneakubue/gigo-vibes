import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);

const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Choose a logo image to upload." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Logo must be PNG, JPG, WEBP, GIF, or SVG." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Logo must be 2MB or smaller." },
        { status: 400 },
      );
    }

    const extension =
      file.type === "image/svg+xml"
        ? "svg"
        : file.type === "image/jpeg" || file.type === "image/jpg"
          ? "jpg"
          : file.type === "image/webp"
            ? "webp"
            : file.type === "image/gif"
              ? "gif"
              : "png";

    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);

    const filename = `${safeName || "logo"}-${Date.now()}.${extension}`;
    const directory = path.join(process.cwd(), "public", "tech-logos");
    await mkdir(directory, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(directory, filename), buffer);

    return NextResponse.json({ logo: `/tech-logos/${filename}` });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to upload logo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
