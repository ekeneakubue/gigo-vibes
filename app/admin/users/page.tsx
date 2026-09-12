import { AdminUsersClient } from "../../components/admin/users-page";
import { listAdminUsers } from "../../lib/users";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let users: Awaited<ReturnType<typeof listAdminUsers>> = [];
  let loadError = "";

  try {
    users = await listAdminUsers();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load users from the database.";
  }

  return <AdminUsersClient initialUsers={users} loadError={loadError} />;
}
