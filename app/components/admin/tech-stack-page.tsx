"use client";

import { ChangeEvent, FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  type AdminTechStackItem,
} from "../../lib/tech-stack";

const emptyForm = {
  name: "",
  logo: "",
  layer: "",
  purpose: "",
};

const fieldClassName =
  "w-full rounded-[10px] border-2 border-[#c5cad6] bg-white px-3.5 py-2.5 outline-none focus:border-red-600";

type ModalMode = "create" | "edit";

function TechLogoBadge({
  logo,
  mark,
  className = "size-11",
}: {
  logo: string;
  mark: string;
  className?: string;
}) {
  if (logo) {
    return (
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d5dae6] bg-[#f4f5f9] ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt=""
          className="size-full object-contain p-1.5"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-xl bg-[#eef0f6] font-mono text-[13px] font-semibold tracking-tight text-[#0c0e16] ${className}`}
    >
      {mark}
    </span>
  );
}

export function AdminTechStackClient({
  initialItems,
  loadError = "",
}: {
  initialItems: AdminTechStackItem[];
  loadError?: string;
}) {
  const [items, setItems] = useState<AdminTechStackItem[]>(initialItems);
  const [mode, setMode] = useState<ModalMode | null>(null);
  const [editingItem, setEditingItem] = useState<AdminTechStackItem | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<AdminTechStackItem | null>(
    null,
  );
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const titleId = useId();
  const deleteTitleId = useId();
  const logoInputId = useId();
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (!mode && !itemToDelete) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (itemToDelete) {
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
  }, [mode, itemToDelete]);

  useEffect(() => {
    return () => {
      if (logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  function resetLogoState() {
    if (logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview("");
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  }

  function openCreateModal() {
    setMode("create");
    setEditingItem(null);
    setError("");
    setForm(emptyForm);
    resetLogoState();
  }

  function openEditModal(item: AdminTechStackItem) {
    setMode("edit");
    setEditingItem(item);
    setError("");
    setForm({
      name: item.name,
      logo: item.logo,
      layer: item.layer,
      purpose: item.purpose,
    });
    if (logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview(item.logo);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  }

  function closeModal() {
    setMode(null);
    setEditingItem(null);
    setError("");
    setForm(emptyForm);
    resetLogoState();
  }

  function openDeleteModal(item: AdminTechStackItem) {
    setItemToDelete(item);
    setDeleteError("");
  }

  function closeDeleteModal() {
    if (deleting) return;
    setItemToDelete(null);
    setDeleteError("");
  }

  function onLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setError("");
  }

  function clearLogo() {
    resetLogoState();
    setForm((current) => ({ ...current, logo: "" }));
  }

  async function uploadLogo(file: File) {
    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/tech-stack/upload", {
      method: "POST",
      body,
    });
    const payload = (await response.json()) as {
      logo?: string;
      error?: string;
    };

    if (!response.ok || !payload.logo) {
      throw new Error(payload.error || "Unable to upload logo");
    }

    return payload.logo;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      let logo = form.logo;
      if (logoFile) {
        logo = await uploadLogo(logoFile);
      }

      if (!logo) {
        throw new Error("Upload a logo for this technology.");
      }

      const payloadBody = {
        name: form.name,
        logo,
        layer: form.layer,
        purpose: form.purpose,
      };

      if (mode === "create") {
        const response = await fetch("/api/admin/tech-stack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        });
        const payload = (await response.json()) as {
          item?: AdminTechStackItem;
          error?: string;
        };

        if (!response.ok || !payload.item) {
          throw new Error(payload.error || "Unable to create item");
        }

        setItems((current) => [...current, payload.item!]);
      } else if (mode === "edit" && editingItem) {
        const response = await fetch(
          `/api/admin/tech-stack/${editingItem.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadBody),
          },
        );
        const payload = (await response.json()) as {
          item?: AdminTechStackItem;
          error?: string;
        };

        if (!response.ok || !payload.item) {
          throw new Error(payload.error || "Unable to update item");
        }

        setItems((current) =>
          current.map((item) =>
            item.id === payload.item!.id ? payload.item! : item,
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
    if (!itemToDelete) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/admin/tech-stack/${itemToDelete.id}`,
        { method: "DELETE" },
      );
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete item");
      }

      setItems((current) =>
        current.filter((item) => item.id !== itemToDelete.id),
      );
      setItemToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Unable to delete item",
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
            Tech Stack
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c0e16]">
            Core technology stack
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4b5563]">
            These tools power the Core Technology Stack section on the marketing
            homepage.
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
          Add technology
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-[#d5dae6] bg-white px-5 py-10 text-center text-sm text-[#4b5563] sm:col-span-2 xl:col-span-3">
            No technologies yet. Add one to get started.
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="relative overflow-hidden rounded-2xl border border-[#d5dae6] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <TechLogoBadge
                    logo={item.logo}
                    mark={item.mark}
                  />
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#155e75] uppercase">
                      {item.layer}
                    </span>
                    <h2 className="mt-1 text-base font-semibold tracking-tight text-[#0c0e16]">
                      {item.name}
                    </h2>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="grid size-9 place-items-center rounded-[10px] border border-[#d5dae6] text-[#374151] transition-colors hover:border-[#c5cad6] hover:bg-[#f4f5f9] hover:text-[#0c0e16]"
                    aria-label={`Edit ${item.name}`}
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
                    onClick={() => openDeleteModal(item)}
                    disabled={deleting && itemToDelete?.id === item.id}
                    className="grid size-9 place-items-center rounded-[10px] border border-[#f1c4c4] text-[#b91c1c] transition-colors hover:bg-[#fef2f2] disabled:opacity-50"
                    aria-label={`Delete ${item.name}`}
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

              <p className="mt-4 text-sm leading-6 text-[#4b5563]">
                {item.purpose}
              </p>
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
                  Tech Stack
                </p>
                <h2
                  id={titleId}
                  className="mt-1 text-xl font-semibold tracking-tight text-[#0c0e16]"
                >
                  {mode === "create" ? "Add Technology" : "Edit Technology"}
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
              <div className="flex flex-col items-center text-center">
                <span className="mb-2 text-sm font-medium text-[#3d4558]">
                  Logo
                </span>
                <label
                  htmlFor={logoInputId}
                  className="group relative flex size-28 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#c5cad6] bg-[#f7f8fb] transition-colors hover:border-red-600 hover:bg-[#fef2f2]"
                >
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="size-full object-contain p-3"
                    />
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        className="size-7 text-[#6b7280] transition-colors group-hover:text-red-600"
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
                      <span className="mt-2 text-[11px] font-medium tracking-wide text-[#6b7280] uppercase">
                        Upload
                      </span>
                    </>
                  )}
                  <input
                    ref={logoInputRef}
                    id={logoInputId}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    onChange={onLogoChange}
                    className="sr-only"
                  />
                </label>
                <p className="mt-2 text-xs text-[#6b7280]">
                  PNG, JPG, WEBP, GIF or SVG · max 2MB
                </p>
                {logoPreview ? (
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="mt-2 text-xs font-semibold tracking-wider text-[#b91c1c] uppercase hover:underline"
                  >
                    Remove logo
                  </button>
                ) : null}
              </div>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className={`${fieldClassName} h-11 text-[#0c0e16]`}
                  placeholder="Cursor AI"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Layer
                </span>
                <input
                  required
                  value={form.layer}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      layer: event.target.value,
                    }))
                  }
                  className={`${fieldClassName} h-11 text-[#0c0e16]`}
                  placeholder="AI editor"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Purpose
                </span>
                <textarea
                  required
                  rows={3}
                  value={form.purpose}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      purpose: event.target.value,
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
                      ? "Add Technology"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {itemToDelete ? (
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
                  Delete technology
                </p>
                <h2
                  id={deleteTitleId}
                  className="mt-1 text-xl font-semibold tracking-tight text-[#0c0e16]"
                >
                  Delete {itemToDelete.name}?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4b5563]">
                  This will permanently remove it from the Core Technology Stack
                  section. This cannot be undone.
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
                {deleting ? "Deleting…" : "Delete Technology"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
