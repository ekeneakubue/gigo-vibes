import { NextResponse } from "next/server";
import {
  deleteFaq,
  findFaqById,
  updateFaq,
} from "../../../../lib/faqs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      question?: string;
      answer?: string;
    };

    const existing = await findFaqById(id);
    if (!existing) {
      return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
    }

    const question = body.question?.trim() ?? "";
    const answer = body.answer?.trim() ?? "";

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required." },
        { status: 400 },
      );
    }

    const faq = await updateFaq(id, { question, answer });
    return NextResponse.json({ faq });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing FAQ id." }, { status: 400 });
    }

    const existing = await findFaqById(id);
    if (!existing) {
      return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
    }

    await deleteFaq(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
