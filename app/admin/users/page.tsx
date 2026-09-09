"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { demoUsers } from "../../lib/content";

type UserStatus = "active" | "pending" | "refunded";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  paidAt: string;
  channel: string;
};

const statusStyles = {
  active: "bg-lime-brand/25 text-[#365314]",
  pending: "bg-cyan-brand/20 text-[#155e75]",
  refunded: "bg-red-500/15 text-[#b91c1c]",
} as const;

const emptyForm = {
  name: "",
  email: "",
  password: "",
  status: "active" as UserStatus,
};

const fieldClassName =
  "h-11 w-full rounded-[10px] border-2 border-[#c5cad6] bg-white px-3.5 outline-none focus:border-red-600";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(demoUsers);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function closeModal() {
    setOpen(false);
    setShowPassword(false);
    setForm(emptyForm);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;
    if (!name || !email || !password) return;

    setUsers((current) => [
      {
        id: `usr_${String(current.length + 1).padStart(2, "0")}`,
        name,
        email,
        status: form.status,
        paidAt: new Date().toISOString().slice(0, 10),
        channel: "—",
      },
      ...current,
    ]);
    closeModal();
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
            People who purchased GigoPlanet Coding Vibes. Demo data until a
            database is connected.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
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
                <th className="px-4 py-3 font-semibold">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e8f0]">
              {users.map((user) => (
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
                  <td className="px-4 py-4 font-medium text-[#374151]">
                    {user.channel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open ? (
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
                  Add New User
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
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    className={`${fieldClassName} pr-12 text-[#0c0e16]`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#4b5563] hover:bg-[#f4f5f9] hover:text-[#0c0e16]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                      status: event.target.value as UserStatus,
                    }))
                  }
                  className={`${fieldClassName} text-[#0c0e16]`}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </label>

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
                  className="rounded-[10px] bg-red-600 px-4 py-2.5 text-xs font-extrabold tracking-wider text-white uppercase"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
