"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import type { AdminFaq } from "../../lib/faqs";

const emptyForm = {
  question: "",
  answer: "",
};

const fieldClassName =
  "w-full rounded-[10px] border-2 border-[#c5cad6] bg-white px-3.5 py-2.5 outline-none focus:border-red-600";

type ModalMode = "create" | "edit";

export function AdminFaqsClient({
  initialFaqs,
  loadError = "",
}: {
  initialFaqs: AdminFaq[];
  loadError?: string;
}) {
  const [faqs, setFaqs] = useState<AdminFaq[]>(initialFaqs);
  const [mode, setMode] = useState<ModalMode | null>(null);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<AdminFaq | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const titleId = useId();
  const deleteTitleId = useId();

  useEffect(() => {
    setFaqs(initialFaqs);
  }, [initialFaqs]);

  useEffect(() => {
    if (!mode && !faqToDelete) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (faqToDelete) {
        closeDeleteModal();
        return;
      }
      closeModal();
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [mode, faqToDelete]);

  function openCreateModal() {
    setMode("create");
    setEditingFaq(null);
    setError("");
    setForm(emptyForm);
  }

  function openEditModal(faq: AdminFaq) {
    setMode("edit");
    setEditingFaq(faq);
    setError("");
    setForm({
      question: faq.question,
      answer: faq.answer,
    });
  }

  function closeModal() {
    setMode(null);
    setEditingFaq(null);
    setError("");
    setForm(emptyForm);
  }

  function openDeleteModal(faq: AdminFaq) {
    setFaqToDelete(faq);
    setDeleteError("");
  }

  function closeDeleteModal() {
    if (deleting) return;
    setFaqToDelete(null);
    setDeleteError("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payloadBody = {
      question: form.question,
      answer: form.answer,
    };

    try {
      if (mode === "create") {
        const response = await fetch("/api/admin/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        });
        const payload = (await response.json()) as {
          faq?: AdminFaq;
          error?: string;
        };

        if (!response.ok || !payload.faq) {
          throw new Error(payload.error || "Unable to create FAQ");
        }

        setFaqs((current) => [...current, payload.faq!]);
      } else if (mode === "edit" && editingFaq) {
        const response = await fetch(`/api/admin/faqs/${editingFaq.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        });
        const payload = (await response.json()) as {
          faq?: AdminFaq;
          error?: string;
        };

        if (!response.ok || !payload.faq) {
          throw new Error(payload.error || "Unable to update FAQ");
        }

        setFaqs((current) =>
          current.map((faq) =>
            faq.id === payload.faq!.id ? payload.faq! : faq,
          ),
        );
      }

      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!faqToDelete) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/admin/faqs/${faqToDelete.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete FAQ");
      }

      setFaqs((current) =>
        current.filter((faq) => faq.id !== faqToDelete.id),
      );
      setFaqToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Unable to delete FAQ",
      );
    } finally {
      setDeleting(false);
    }
  }

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
          {loadError ? (
            <p className="mt-3 text-sm font-medium text-[#b91c1c]">{loadError}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-[10px] bg-red-600 px-5 py-3 text-xs font-extrabold tracking-wider text-white uppercase"
        >
          Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="rounded-2xl border border-[#d5dae6] bg-white px-5 py-10 text-center text-sm text-[#4b5563]">
            No FAQs yet. Add one to get started.
          </div>
        ) : (
          faqs.map((faq, index) => (
            <article
              key={faq.id}
              className="rounded-2xl border border-[#d5dae6] bg-white p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-2xl font-semibold text-[#9aa1bd] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold tracking-tight text-[#0c0e16] sm:text-lg">
                      {faq.question}
                    </h2>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(faq)}
                        className="grid size-9 place-items-center rounded-[10px] border border-[#d5dae6] text-[#374151] transition-colors hover:border-[#c5cad6] hover:bg-[#f4f5f9] hover:text-[#0c0e16]"
                        aria-label={`Edit ${faq.question}`}
                        title="Edit"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3zM13.5 6.5l3 3"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(faq)}
                        disabled={deleting && faqToDelete?.id === faq.id}
                        className="grid size-9 place-items-center rounded-[10px] border border-[#f1c4c4] text-[#b91c1c] transition-colors hover:bg-[#fef2f2] disabled:opacity-50"
                        aria-label={`Delete ${faq.question}`}
                        title="Delete"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {mode ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#d5dae6] bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-[#155e75] uppercase">
                  FAQs
                </p>
                <h2
                  id={titleId}
                  className="mt-1 text-xl font-semibold tracking-tight text-[#0c0e16]"
                >
                  {mode === "create" ? "Add FAQ" : "Edit FAQ"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="grid size-9 place-items-center rounded-[10px] border border-[#d5dae6] text-[#4b5563] hover:bg-[#f4f5f9] hover:text-[#0c0e16]"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Question
                </span>
                <input
                  required
                  value={form.question}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      question: event.target.value,
                    }))
                  }
                  className={`${fieldClassName} h-11 text-[#0c0e16]`}
                  placeholder="Do I need to know how to code already?"
                  autoFocus
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Answer
                </span>
                <textarea
                  required
                  rows={5}
                  value={form.answer}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      answer: event.target.value,
                    }))
                  }
                  className={`${fieldClassName} text-[#0c0e16]`}
                />
              </label>

              {error ? (
                <p className="text-sm font-medium text-[#b91c1c]">{error}</p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-[10px] border-2 border-[#c5cad6] px-4 py-2.5 text-xs font-semibold tracking-wider text-[#374151] uppercase hover:bg-[#f4f5f9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[10px] bg-red-600 px-4 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : mode === "create"
                      ? "Add FAQ"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {faqToDelete ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/40"
            onClick={closeDeleteModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteTitleId}
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#d5dae6] bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#fef2f2] text-[#b91c1c]">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] tracking-[0.2em] text-[#b91c1c] uppercase">
                  Delete FAQ
                </p>
                <h2
                  id={deleteTitleId}
                  className="mt-1 text-xl font-semibold tracking-tight text-[#0c0e16]"
                >
                  Delete this question?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4b5563]">
                  This will permanently remove{" "}
                  <span className="font-medium text-[#0c0e16]">
                    {faqToDelete.question}
                  </span>{" "}
                  from the homepage FAQ. This cannot be undone.
                </p>
              </div>
            </div>

            {deleteError ? (
              <p className="mt-4 text-sm font-medium text-[#b91c1c]">
                {deleteError}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-[10px] border-2 border-[#c5cad6] px-4 py-2.5 text-xs font-semibold tracking-wider text-[#374151] uppercase hover:bg-[#f4f5f9] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-[10px] bg-red-600 px-4 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete FAQ"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
