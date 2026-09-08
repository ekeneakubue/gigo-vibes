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
        href="#buy"
        className={`w-full rounded-[10px] bg-red-600 px-8 py-3.5 text-center text-sm font-extrabold tracking-wider text-white uppercase shadow-lg shadow-red-600/35 transition-all hover:scale-[1.03] hover:bg-red-500 ${
          isRow ? "sm:w-auto sm:shrink-0" : ""
        }`}
      >
        Buy now — ₦10,000
      </a>
      <a
        href="#buy"
        className={`w-full rounded-[10px] px-8 py-3.5 text-center text-sm font-semibold transition-colors ${
          isRow
            ? "bg-white text-black hover:bg-white/90 sm:w-auto sm:shrink-0"
            : "border border-foreground/15 bg-foreground/5 text-foreground hover:bg-foreground/10"
        }`}
      >
        Not Nigerian? — Buy Here
      </a>
    </div>
  );
}
