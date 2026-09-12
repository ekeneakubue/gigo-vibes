import { AdminFaqsClient } from "../../components/admin/faqs-page";
import { listAdminFaqs } from "../../lib/faqs";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  let faqs: Awaited<ReturnType<typeof listAdminFaqs>> = [];
  let loadError = "";

  try {
    faqs = await listAdminFaqs();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load FAQs from the database.";
  }

  return <AdminFaqsClient initialFaqs={faqs} loadError={loadError} />;
}
