export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="neu relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background p-0.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt=""
          className="size-full rounded-full object-cover"
        />
      </span>
      <span className="text-[15px] leading-tight font-semibold tracking-tight">
        <span className="text-blue-600">Gigo</span>
        <span className="text-red-600">Planet</span>
        <span className="block font-mono text-[10px] tracking-[0.22em] text-sky-400 uppercase">
          Coding Vibes
        </span>
      </span>
    </span>
  );
}
