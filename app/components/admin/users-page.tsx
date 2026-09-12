"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import type { AdminUser, AdminUserStatus } from "../../lib/users";

const statusStyles = {
  active: "bg-lime-brand/25 text-[#365314]",
  pending: "bg-cyan-brand/20 text-[#155e75]",
  refunded: "bg-red-500/15 text-[#b91c1c]",
} as const;

const emptyForm = {
  name: "",
  email: "",
  password: "",
  status: "active" as AdminUserStatus,
};

const fieldClassName =
  "h-11 w-full rounded-[10px] border-2 border-[#c5cad6] bg-white px-3.5 outline-none focus:border-red-600";

type ModalMode = "create" | "edit";

export function AdminUsersClient({
  initialUsers,
  loadError = "",
}: {
  initialUsers: AdminUser[];
  loadError?: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [mode, setMode] = useState<ModalMode | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const titleId = useId();
  const deleteTitleId = useId();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    if (!mode && !userToDelete) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (userToDelete) {
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
  }, [mode, userToDelete]);

  function openCreateModal() {
    setMode("create");
    setEditingUser(null);
    setShowPassword(false);
    setError("");
    setForm(emptyForm);
  }

  function openEditModal(user: AdminUser) {
    setMode("edit");
    setEditingUser(user);
    setShowPassword(false);
    setError("");
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      status: user.status,
    });
  }

  function closeModal() {
    setMode(null);
    setEditingUser(null);
    setShowPassword(false);
    setError("");
    setForm(emptyForm);
  }

  function openDeleteModal(user: AdminUser) {
    setUserToDelete(user);
    setDeleteError("");
  }

  function closeDeleteModal() {
    if (deleting) return;
    setUserToDelete(null);
    setDeleteError("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (mode === "create") {
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const payload = (await response.json()) as {
          user?: AdminUser;
          error?: string;
        };

        if (!response.ok || !payload.user) {
          throw new Error(payload.error || "Unable to create user");
        }

        setUsers((current) => [payload.user!, ...current]);
      } else if (mode === "edit" && editingUser) {
        const response = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            status: form.status,
            ...(form.password ? { password: form.password } : {}),
          }),
        });
        const payload = (await response.json()) as {
          user?: AdminUser;
          error?: string;
        };

        if (!response.ok || !payload.user) {
          throw new Error(payload.error || "Unable to update user");
        }

        setUsers((current) =>
          current.map((user) =>
            user.id === payload.user!.id ? payload.user! : user,
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
    if (!userToDelete) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete user");
      }

      setUsers((current) =>
        current.filter((item) => item.id !== userToDelete.id),
      );
      setUserToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Unable to delete user",
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
            Users
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c0e16]">
            Students
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4b5563]">
            People who purchased GigoPlanet Coding Vibes, loaded from your
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
          Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#d5dae6] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#0c0e16]">
            <thead className="border-b border-[#d5dae6] bg-[#eef0f6] font-mono text-[11px] tracking-wider text-[#3d4558] uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Paid</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e8f0]">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-[#4b5563]"
                  >
                    No users yet. Add one to get started.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="bg-white">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#0c0e16]">{user.name}</p>
                      <p className="text-xs text-[#4b5563]">{user.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase ${statusStyles[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs font-medium text-[#374151]">
                      {user.paidAt}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="grid size-9 place-items-center rounded-[10px] border border-[#d5dae6] text-[#374151] transition-colors hover:border-[#c5cad6] hover:bg-[#f4f5f9] hover:text-[#0c0e16]"
                          aria-label={`Edit ${user.name}`}
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
                          onClick={() => openDeleteModal(user)}
                          disabled={deleting && userToDelete?.id === user.id}
                          className="grid size-9 place-items-center rounded-[10px] border border-[#f1c4c4] text-[#b91c1c] transition-colors hover:bg-[#fef2f2] disabled:opacity-50"
                          aria-label={`Delete ${user.name}`}
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
            className="relative z-10 w-full max-w-md rounded-2xl border border-foreground/10 bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-[#155e75] uppercase">
                  Users
                </p>
                <h2
                  id={titleId}
                  className="mt-1 text-xl font-semibold tracking-tight text-[#0c0e16]"
                >
                  {mode === "create" ? "Add New User" : "Edit User"}
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
                  Full name
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
                  className={`${fieldClassName} text-[#0c0e16]`}
                  autoComplete="name"
                  autoFocus
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className={`${fieldClassName} text-[#0c0e16]`}
                  autoComplete="email"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Password
                  {mode === "edit" ? (
                    <span className="font-normal text-[#6b7280]">
                      {" "}
                      (leave blank to keep)
                    </span>
                  ) : null}
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={mode === "create"}
                    minLength={mode === "create" || form.password ? 8 : undefined}
                    value={form.password}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    className={`${fieldClassName} pr-12 text-[#0c0e16]`}
                    autoComplete="new-password"
                    placeholder={mode === "edit" ? "••••••••" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#4b5563] hover:bg-[#f4f5f9] hover:text-[#0c0e16]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4.5"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 3l18 18M10.5 10.7a2.5 2.5 0 0 0 3.3 3.3M9.9 5.6A9.8 9.8 0 0 1 12 5.3c5 0 9.3 3.2 10.7 6.7a11.4 11.4 0 0 1-4.1 4.8M6.1 6.4A11.5 11.5 0 0 0 1.3 12C2.7 15.5 7 18.7 12 18.7c1.4 0 2.7-.2 3.9-.7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4.5"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-[#3d4558]">
                  Status
                </span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as AdminUserStatus,
                    }))
                  }
                  className={`${fieldClassName} text-[#0c0e16]`}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
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
                      ? "Add User"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {userToDelete ? (
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
                  Delete user
                </p>
                <h2
                  id={deleteTitleId}
                  className="mt-1 text-xl font-semibold tracking-tight text-[#0c0e16]"
                >
                  Delete {userToDelete.name}?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4b5563]">
                  This will permanently remove{" "}
                  <span className="font-medium text-[#0c0e16]">
                    {userToDelete.email}
                  </span>{" "}
                  from the database. This cannot be undone.
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
                {deleting ? "Deleting…" : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
