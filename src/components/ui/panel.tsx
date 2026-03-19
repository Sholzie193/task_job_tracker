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
        "neo-panel rounded-[30px] p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
