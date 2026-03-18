import { SiteHeader } from "@/components/app-shell/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-24 h-72 w-72 rounded-full bg-cyan-400/12 blur-[140px]" />
        <div className="absolute right-[10%] top-56 h-80 w-80 rounded-full bg-sky-400/10 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/8 blur-[180px]" />
      </div>
      <SiteHeader />
      <main className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 pt-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

