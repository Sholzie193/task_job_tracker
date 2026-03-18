import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[30px] border border-white/10 bg-white/6 p-6 shadow-[0_20px_80px_-40px_rgba(11,18,32,0.95)] backdrop-blur-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

