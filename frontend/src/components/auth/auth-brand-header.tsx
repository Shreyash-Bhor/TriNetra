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
      <p className="text-3xl font-bold text-foreground mb-2">Trinetra</p>
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <p className="text-muted-foreground text-balance mt-1">{subtitle}</p>
    </div>
  );
}
