"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import type { AdminCurriculumModule } from "../../lib/curriculum";

const emptyForm = {
  label: "",
  title: "",
  description: "",
  lessons: [""] as string[],
};

const fieldClassName =
  "w-full rounded-[10px] border-2 border-[#c5cad6] bg-white px-3.5 py-2.5 outline-none focus:border-red-600";

type ModalMode = "create" | "edit";

export function AdminCurriculumClient({
  initialModules,
  loadError = "",
}: {
  initialModules: AdminCurriculumModule[];
  loadError?: string;
}) {
  const [modules, setModules] =
    useState<AdminCurriculumModule[]>(initialModules);
  const [mode, setMode] = useState<ModalMode | null>(null);
  const [editingModule, setEditingModule] =
    useState<AdminCurriculumModule | null>(null);
  const [moduleToDelete, setModuleToDelete] =
    useState<AdminCurriculumModule | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const titleId = useId();
  const deleteTitleId = useId();

  useEffect(() => {
    setModules(initialModules);
  }, [initialModules]);

  useEffect(() => {
    if (!mode && !moduleToDelete) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (moduleToDelete) {
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
  }, [mode, moduleToDelete]);

  function openCreateModal() {
    setMode("create");
    setEditingModule(null);
    setError("");
    setForm({
      ...emptyForm,
      label: `Module ${String(modules.length + 1).padStart(2, "0")}`,
      lessons: [""],
    });
  }

  function openEditModal(module: AdminCurriculumModule) {
    setMode("edit");
    setEditingModule(module);
    setError("");
    setForm({
      label: module.label,
      title: module.title,
      description: module.description,
      lessons: module.lessons.length > 0 ? [...module.lessons] : [""],
    });
  }

  function closeModal() {
    setMode(null);
    setEditingModule(null);
    setError("");
    setForm(emptyForm);
  }

  function updateLesson(index: number, value: string) {
    setForm((current) => ({
      ...current,
      lessons: current.lessons.map((lesson, lessonIndex) =>
        lessonIndex === index ? value : lesson,
      ),
    }));
  }

  function addLesson() {
    setForm((current) => ({
      ...current,
      lessons: [...current.lessons, ""],
    }));
  }

  function removeLesson(index: number) {
    setForm((current) => {
      const next = current.lessons.filter((_, lessonIndex) => lessonIndex !== index);
      return {
        ...current,
        lessons: next.length > 0 ? next : [""],
      };
    });
  }

  function openDeleteModal(module: AdminCurriculumModule) {
    setModuleToDelete(module);
    setDeleteError("");
  }

  function closeDeleteModal() {
    if (deleting) return;
    setModuleToDelete(null);
    setDeleteError("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payloadBody = {
      label: form.label,
      title: form.title,
      description: form.description,
      lessons: form.lessons.join("\n"),
    };

    try {
      if (mode === "create") {
        const response = await fetch("/api/admin/curriculum", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        });
        const payload = (await response.json()) as {
          module?: AdminCurriculumModule;
          error?: string;
        };

        if (!response.ok || !payload.module) {
          throw new Error(payload.error || "Unable to create module");
        }

        setModules((current) => [...current, payload.module!]);
      } else if (mode === "edit" && editingModule) {
        const response = await fetch(
          `/api/admin/curriculum/${editingModule.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadBody),
          },
        );
        const payload = (await response.json()) as {
          module?: AdminCurriculumModule;
          error?: string;
        };

        if (!response.ok || !payload.module) {
          throw new Error(payload.error || "Unable to update module");
        }

        setModules((current) =>
          current.map((module) =>
            module.id === payload.module!.id ? payload.module! : module,
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
    if (!moduleToDelete) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/admin/curriculum/${moduleToDelete.id}`,
        { method: "DELETE" },
      );
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete module");
      }

      setModules((current) =>
        current.filter((module) => module.id !== moduleToDelete.id),
      );
      setModuleToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Unable to delete module",
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
            Curriculum
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c0e16]">
            Modules & lessons
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4b5563]">
            Content shown on the public curriculum section, loaded from your
            database.
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
          Add module
        </button>
      </div>

      <div className="space-y-3">
        {modules.length === 0 ? (
          <div className="rounded-2xl border border-[#d5dae6] bg-white px-5 py-10 text-center text-sm text-[#4b5563]">
            No modules yet. Add one to get started.
          </div>
        ) : (
          modules.map((module, index) => (
            <article
              key={module.id}
              className="rounded-2xl border border-[#d5dae6] bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] font-semibold tracking-wider text-[#155e75] uppercase">
                    {module.label}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#0c0e16]">
                    <span className="mr-2 font-mono text-[#9aa1bd]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {module.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4b5563]">
                    {module.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <span className="font-mono text-xs font-medium whitespace-nowrap text-[#374151]">
                    {module.lessons.length} lessons
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(module)}
                      className="grid size-9 place-items-center rounded-[10px] border border-[#d5dae6] text-[#374151] transition-colors hover:border-[#c5cad6] hover:bg-[#f4f5f9] hover:text-[#0c0e16]"
                      aria-label={`Edit ${module.title}`}
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
                      onClick={() => openDeleteModal(module)}
                      disabled={deleting && moduleToDelete?.id === module.id}
                      className="grid size-9 place-items-center rounded-[10px] border border-[#f1c4c4] text-[#b91c1c] transition-colors hover:bg-[#fef2f2] disabled:opacity-50"
                      aria-label={`Delete ${module.title}`}
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
              </div>

              <ol className="mt-5 grid gap-2 sm:grid-cols-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li
                    key={`${module.id}-${lessonIndex}`}
                    className="flex gap-3 rounded-[10px] border border-[#d5dae6] bg-[#f4f5f9] px-3 py-3 text-sm"
                  >
                    <span className="font-mono text-[11px] font-semibold text-[#b91c1c] tabular-nums">
                      {String(lessonIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-[#0c0e16]">{lesson}</span>
                  </li>
                ))}
              </ol>
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
                  Curriculum
                </p>
                <h2
                  id={titleId}
                  className="mt-1 text-xl font-semibold tracking-tight text-[#0c0e16]"
                >
                  {mode === "create" ? "Add Module" : "Edit Module"}
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
                  Label
                </span>
                <input
                  required
                  value={form.label}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  className={`${fieldClassName} h-11 text-[#0c0e16]`}
                  placeholder="Module 01"
                  autoFocus
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Title
                </span>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className={`${fieldClassName} h-11 text-[#0c0e16]`}
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Description
                </span>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className={`${fieldClassName} text-[#0c0e16]`}
                />
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#3d4558]">
                    Lessons
                  </span>
                  <button
                    type="button"
                    onClick={addLesson}
                    className="grid size-9 place-items-center rounded-[10px] border border-[#d5dae6] text-[#374151] transition-colors hover:border-[#c5cad6] hover:bg-[#f4f5f9] hover:text-[#0c0e16]"
                    aria-label="Add lesson"
                    title="Add lesson"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  {form.lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-7 shrink-0 font-mono text-[11px] font-semibold text-[#b91c1c] tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <input
                        required
                        value={lesson}
                        onChange={(event) =>
                          updateLesson(index, event.target.value)
                        }
                        className={`${fieldClassName} h-11 flex-1 text-[#0c0e16]`}
                        placeholder={`Lesson ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        disabled={form.lessons.length === 1}
                        className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-[#f1c4c4] text-[#b91c1c] transition-colors hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Remove lesson ${index + 1}`}
                        title="Remove lesson"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 12h14"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

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
                      ? "Add Module"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {moduleToDelete ? (
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
                  Delete module
                </p>
                <h2
                  id={deleteTitleId}
                  className="mt-1 text-xl font-semibold tracking-tight text-[#0c0e16]"
                >
                  Delete {moduleToDelete.title}?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4b5563]">
                  This will permanently remove{" "}
                  <span className="font-medium text-[#0c0e16]">
                    {moduleToDelete.label}
                  </span>{" "}
                  and its {moduleToDelete.lessons.length} lessons. This cannot
                  be undone.
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
                {deleting ? "Deleting…" : "Delete Module"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
