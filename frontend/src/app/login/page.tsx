"use client";
import { LoginForm } from "../../components/login";
import { Navigation } from "../../components/navigation";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <Navigation />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <LoginForm />
      </main>
    </div>
  );
}
