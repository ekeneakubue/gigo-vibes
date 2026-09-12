import type { Metadata } from "next";
import { AdminSidebar } from "../components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin",
  description: "GigoPlanet Coding Vibes admin dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row">
      <AdminSidebar />
      <div className="admin-panel flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
