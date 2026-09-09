import { faqItems } from "../../lib/content";

export default function AdminFaqsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 text-[#0c0e16]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#155e75] uppercase">
            FAQs
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c0e16]">
            Questions & answers
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4b5563]">
            These entries power the FAQ accordion on the marketing homepage.
          </p>
        </div>
        <button
          type="button"
          className="rounded-[10px] bg-red-600 px-5 py-3 text-xs font-extrabold tracking-wider text-white uppercase"
        >
          Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqItems.map((faq, index) => (
          <article
            key={faq.question}
            className="rounded-2xl border border-[#d5dae6] bg-white p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <span className="font-mono text-2xl font-semibold text-[#9aa1bd] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-tight text-[#0c0e16] sm:text-lg">
                  {faq.question}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                  {faq.answer}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
