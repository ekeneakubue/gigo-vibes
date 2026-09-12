import { AdminCurriculumClient } from "../../components/admin/curriculum-page";
import { listAdminCurriculumModules } from "../../lib/curriculum";

export const dynamic = "force-dynamic";

export default async function AdminCurriculumPage() {
  let modules: Awaited<ReturnType<typeof listAdminCurriculumModules>> = [];
  let loadError = "";

  try {
    modules = await listAdminCurriculumModules();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load curriculum from the database.";
  }

  return (
    <AdminCurriculumClient initialModules={modules} loadError={loadError} />
  );
}
