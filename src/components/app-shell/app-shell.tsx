import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { SiteHeader } from "@/components/app-shell/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[7%] top-20 h-72 w-72 rounded-full bg-[color:var(--accent-soft)] blur-[120px]" />
        <div className="absolute right-[8%] top-56 h-80 w-80 rounded-full bg-[color:var(--accent-soft)] blur-[160px]" />
      </div>
      <div className="relative z-10 flex min-h-screen">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
