import { PropsWithChildren } from "react";
import { Navigation } from "@/components/navigation";

export function AuthPageShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-sky-400/10 to-indigo-500/10 rounded-full blur-2xl animate-pulse delay-300" />
      </div>

      <Navigation />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        {children}
      </main>
    </div>
  );
}
