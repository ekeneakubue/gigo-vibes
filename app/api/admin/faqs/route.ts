import { NextResponse } from "next/server";
import {
  createFaq,
  listAdminFaqs,
  nextFaqSortOrder,
} from "../../../lib/faqs";

export async function GET() {
  try {
    const faqs = await listAdminFaqs();
    return NextResponse.json({ faqs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load FAQs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      question?: string;
      answer?: string;
    };

    const question = body.question?.trim() ?? "";
    const answer = body.answer?.trim() ?? "";

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required." },
        { status: 400 },
      );
    }

    const faq = await createFaq({
      question,
      answer,
      sortOrder: await nextFaqSortOrder(),
    });

    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
