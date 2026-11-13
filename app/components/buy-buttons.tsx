import { PAYSTACK_CHECKOUT_URL } from "../lib/links";

export function BuyButtons({
  className = "",
  layout = "column",
}: {
  className?: string;
  layout?: "column" | "row";
}) {
  const isRow = layout === "row";

  return (
    <div
      className={`flex w-full gap-3 ${
        isRow
          ? "max-w-xl flex-col sm:flex-row"
          : "max-w-sm flex-col"
      } ${className}`}
    >
      <a
        href={PAYSTACK_CHECKOUT_URL}
        className={`neu-md inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-px ${
          isRow ? "sm:w-auto sm:shrink-0" : ""
        }`}
      >
        Buy now — <span className="font-bold text-red-600">₦5,000</span>
      </a>
      <a
        href={PAYSTACK_CHECKOUT_URL}
        className={`neu inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-muted transition hover:opacity-80 active:opacity-60 ${
          isRow ? "sm:w-auto sm:shrink-0" : ""
        }`}
      >
        Not Nigerian? — Buy Here
      </a>
    </div>
  );
}
