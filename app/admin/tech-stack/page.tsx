import { AdminTechStackClient } from "../../components/admin/tech-stack-page";
import { listAdminTechStackItems } from "../../lib/tech-stack";

export const dynamic = "force-dynamic";

export default async function AdminTechStackPage() {
  let items: Awaited<ReturnType<typeof listAdminTechStackItems>> = [];
  let loadError = "";

  try {
    items = await listAdminTechStackItems();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load tech stack from the database.";
  }

  return <AdminTechStackClient initialItems={items} loadError={loadError} />;
}
