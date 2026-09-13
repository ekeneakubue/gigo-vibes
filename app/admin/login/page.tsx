import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminLoginForm } from "../../components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f4f5f9] text-sm text-[#4b5563]">
          Loading sign-in…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
