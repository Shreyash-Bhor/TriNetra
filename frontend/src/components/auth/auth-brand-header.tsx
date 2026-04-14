import { ShieldCheck } from "lucide-react";

export function AuthBrandHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm border border-white/20 mb-4 shadow-lg">
        <ShieldCheck className="h-8 w-8 text-primary" />
      </div>
      <p className="text-3xl font-bold text-foreground mb-2">Trinetra</p>
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <p className="text-muted-foreground text-balance mt-1">{subtitle}</p>
    </div>
  );
}
